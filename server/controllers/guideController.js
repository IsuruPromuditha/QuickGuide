const db = require('../config/db');
const fs = require('fs').promises;
const path = require('path');

const getGuide = async (req, res) => {
    const guideId = req.params.id;
    try {
        const query = `
      SELECT id, name, email, national_id, contact, birthday, country, language, experience, 
             profile_image, bio, rating, reviews, facebook_url, instagram_url, tiktok_url, 
             categories, created_at 
      FROM guides 
      WHERE id = ?`;
        db.query(query, [guideId], (err, results) => {
            if (err) {
                console.error('Error fetching guide:', err);
                return res.status(500).json({ error: 'Failed to fetch guide data' });
            }
            if (results.length === 0) {
                return res.status(404).json({ error: 'Guide not found' });
            }
            const guide = results[0];
            // Parse categories if it's a JSON string
            guide.categories = guide.categories ? JSON.parse(guide.categories) : [];
            res.status(200).json(guide);
        });
    } catch (error) {
        console.error('Error fetching guide:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const updateGuide = async (req, res) => {
    const guideId = req.params.id;
    const { name, bio, country, language, experience, facebook_url, instagram_url, tiktok_url, categories } = req.body;
    const profileImage = req.file ? `/profiles/${req.file.filename}` : null;

    try {
        const updates = {};
        if (name) updates.name = name;
        if (bio) updates.bio = bio;
        if (country) updates.country = country;
        if (language) updates.language = language;
        if (experience) updates.experience = experience;
        if (facebook_url) updates.facebook_url = facebook_url;
        if (instagram_url) updates.instagram_url = instagram_url;
        if (tiktok_url) updates.tiktok_url = tiktok_url;
        if (categories) updates.categories = JSON.stringify(categories);  
        if (profileImage) updates.profile_image = profileImage;

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ error: 'No valid fields provided for update' });
        }

        const query = 'UPDATE guides SET ? WHERE id = ?';
        db.query(query, [updates, guideId], (err, result) => {
            if (err) {
                console.error('Error updating guide:', err);
                return res.status(500).json({ error: 'Failed to update guide' });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Guide not found' });
            }
            res.status(200).json({ message: 'Guide updated successfully' });
        });
    } catch (error) {
        console.error('Error updating guide:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const addPost = async (req, res) => {
    const guideId = req.params.id;
    const { title, caption, location } = req.body;
    const images = req.files ? req.files.map(file => `/posts/${file.filename}`) : [];

    if (!images.length) {
        console.error('No files uploaded');
        return res.status(400).json({ error: 'At least one image is required' });
    }

    if (!title || !caption || !location) {
        return res.status(400).json({ error: 'All fields (title, caption, location) are required' });
    }

    try {
        // Insert post into Posts table
        const postQuery = 'INSERT INTO Posts (guide_id, title, caption, location) VALUES (?, ?, ?, ?)';
        const postResult = await new Promise((resolve, reject) => {
            db.query(postQuery, [guideId, title, caption, location], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        const postId = postResult.insertId;

        // Insert images into PostImages table
        const imageQuery = 'INSERT INTO PostImages (post_id, image) VALUES ?';
        const imageValues = images.map(image => [postId, image]);
        await new Promise((resolve, reject) => {
            db.query(imageQuery, [imageValues], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        res.status(201).json({ message: 'Post added successfully', postId });
    } catch (err) {
        console.error('Database error:', err.message);
        res.status(500).json({ error: 'Database error: ' + err.message });
    }
};

const getPosts = async (req, res) => {
    const guideId = req.params.id;

    try {
        const postsQuery = `
            SELECT p.id, p.title, p.caption, p.location, p.created_at, GROUP_CONCAT(pi.image) as images
            FROM Posts p
            LEFT JOIN PostImages pi ON p.id = pi.post_id
            WHERE p.guide_id = ?
            GROUP BY p.id
            ORDER BY p.created_at DESC
        `;
        const posts = await new Promise((resolve, reject) => {
            db.query(postsQuery, [guideId], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        // Parse images into an array
        const parsedPosts = posts.map(post => ({
            ...post,
            images: post.images ? post.images.split(',') : []
        }));

        res.status(200).json(parsedPosts);
    } catch (err) {
        console.error('Database error:', err.message);
        res.status(500).json({ error: 'Database error: ' + err.message });
    }
};

const addGalleryImage = (req, res) => {
    const guideId = req.params.id;
    const image = req.file ? `/posts/${req.file.filename}` : null;

    if (!image) {
        return res.status(400).json({ error: 'Image is required' });
    }

    const query = 'INSERT INTO Gallery (guide_id, image) VALUES (?, ?)';
    db.query(query, [guideId, image], (err, result) => {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({ error: 'Database error: ' + err.message });
        }
        res.status(201).json({ message: 'Gallery image added successfully', imageId: result.insertId, image });
    });
};

const getGalleryImages = (req, res) => {
    const guideId = req.params.id;

    db.query(
        'SELECT id, image, created_at FROM Gallery WHERE guide_id = ? ORDER BY created_at DESC',
        [guideId],
        (err, results) => {
            if (err) {
                console.error('Database error:', err.message);
                return res.status(500).json({ error: 'Database error: ' + err.message });
            }
            res.status(200).json(results);
        }
    );
};

const deletePost = async (req, res) => {
    const postId = req.params.postId;
    const guideId = req.user.id;

    try {
        // Check if post exists
        const [post] = await new Promise((resolve, reject) => {
            db.query('SELECT * FROM Posts WHERE id = ? AND guide_id = ?', [postId, guideId], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        if (!post) {
            console.error('Post not found or unauthorized:', { postId, guideId });
            return res.status(404).json({ error: 'Post not found or you are not authorized to delete it' });
        }

        // Delete post (images are automatically deleted via ON DELETE CASCADE)
        await new Promise((resolve, reject) => {
            db.query('DELETE FROM Posts WHERE id = ? AND guide_id = ?', [postId, guideId], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (err) {
        console.error('Database error:', err.message);
        res.status(500).json({ error: 'Database error: ' + err.message });
    }
};

const deleteGalleryImage = (req, res) => {
    const imageId = req.params.imageId;

    db.query('DELETE FROM Gallery WHERE id = ?', [imageId], (err, result) => {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({ error: 'Database error: ' + err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Gallery image not found' });
        }
        res.status(200).json({ message: 'Gallery image deleted successfully' });
    });
};

const getAllGuides = (req, res) => {
    db.query(
        'SELECT id, name, profile_image, bio, rating, categories, facebook_url, instagram_url, tiktok_url FROM Guides',
        (err, results) => {
            if (err) {
                console.error('Database error:', err.message);
                return res.status(500).json({ error: 'Database error: ' + err.message });
            }
            const parsedGuides = results.map(guide => ({
                ...guide,
                categories: guide.categories ? JSON.parse(guide.categories) : [],
                social: {
                    facebook: guide.facebook_url,
                    instagram: guide.instagram_url,
                    tiktok: guide.tiktok_url
                }
            }));
            res.status(200).json(parsedGuides);
        }
    );
};

const getGuideProfile = (req, res) => {
    const guideId = req.params.id;

    db.query(
        `SELECT id, name, profile_image, bio, rating, reviews, facebook_url, instagram_url, tiktok_url, categories
         FROM Guides WHERE id = ?`,
        [guideId],
        (err, guideResults) => {
            if (err) {
                console.error('Database error:', err.message);
                return res.status(500).json({ error: 'Database error: ' + err.message });
            }
            if (guideResults.length === 0) {
                return res.status(404).json({ error: 'Guide not found' });
            }

            const guide = guideResults[0];
            guide.categories = guide.categories ? JSON.parse(guide.categories) : [];
            guide.social = {
                facebook: guide.facebook_url,
                instagram: guide.instagram_url,
                tiktok: guide.tiktok_url
            };

            db.query(
                'SELECT image FROM Gallery WHERE guide_id = ? ORDER BY created_at DESC',
                [guideId],
                (err, galleryResults) => {
                    if (err) {
                        console.error('Database error:', err.message);
                        return res.status(500).json({ error: 'Database error: ' + err.message });
                    }

                    guide.gallery = galleryResults.map(item => item.image);
                    res.status(200).json(guide);
                }
            );
        }
    );
};

const getGuidePosts = (req, res) => {
    const guideId = req.params.id;

    const postsQuery = `
        SELECT p.id, p.guide_id, p.title, p.caption, p.location, p.created_at, GROUP_CONCAT(pi.image) as images
        FROM Posts p
        LEFT JOIN PostImages pi ON p.id = pi.post_id
        WHERE p.guide_id = ?
        GROUP BY p.id
        ORDER BY p.created_at DESC
    `;

    db.query(postsQuery, [guideId], (err, results) => {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({ error: 'Database error: ' + err.message });
        }

        const parsedPosts = results.map(post => ({
            ...post,
            images: post.images ? post.images.split(',') : []
        }));

        res.status(200).json(parsedPosts);
    });
};

const updatePost = async (req, res) => {
    const postId = req.params.postId;
    const guideId = req.user.id;
    const { title, caption, location } = req.body;
    const newImages = req.files ? req.files.map(file => `/posts/${file.filename}`) : [];

    try {
        // Check if post exists
        const [post] = await new Promise((resolve, reject) => {
            db.query('SELECT * FROM posts WHERE id = ? AND guide_id = ?', [postId, guideId], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        if (!post) {
            return res.status(404).json({ error: 'Post not found or you are not authorized to update it' });
        }

        // Update post details
        const updates = {};
        if (title) updates.title = title;
        if (caption) updates.caption = caption;
        if (location) updates.location = location;

        if (Object.keys(updates).length > 0) {
            const updateQuery = 'UPDATE posts SET ? WHERE id = ? AND guide_id = ?';
            await new Promise((resolve, reject) => {
                db.query(updateQuery, [updates, postId, guideId], (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                });
            });
        }

        // Add new images if provided
        if (newImages.length > 0) {
            const imageQuery = 'INSERT INTO postimages (post_id, image) VALUES ?';
            const imageValues = newImages.map(image => [postId, image]);
            await new Promise((resolve, reject) => {
                db.query(imageQuery, [imageValues], (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                });
            });
        }

        res.status(200).json({ message: 'Post updated successfully' });
    } catch (err) {
        console.error('Database error:', err.message);
        res.status(500).json({ error: 'Database error: ' + err.message });
    }
};

module.exports = { getGuide, updateGuide, addPost, getPosts, addGalleryImage, getGalleryImages, deletePost, deleteGalleryImage, getAllGuides, getGuideProfile, getGuidePosts, updatePost };