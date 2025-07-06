const db = require('../config/db');
const fs = require('fs').promises;
const path = require('path');

const getGuide = (req, res) => {
    const guideId = req.params.id;

    db.query(
        'SELECT id, name, email, national_id, contact, birthday, country, language, experience, profile_image, bio, rating, reviews, facebook_url, instagram_url, tiktok_url, created_at FROM Guides WHERE id = ?',
        [guideId],
        (err, results) => {
            if (err) {
                console.error('Database error:', err.message);
                return res.status(500).json({ error: 'Database error: ' + err.message });
            }
            if (results.length === 0) {
                return res.status(404).json({ error: 'Guide not found' });
            }
            res.status(200).json(results[0]);
        }
    );
};

const updateGuide = (req, res) => {
    const guideId = req.params.id;
    const { name, bio, facebook_url, instagram_url, tiktok_url, country, language, experience, categories } = req.body;
    const profileImage = req.file ? `/profiles/${req.file.filename}` : null;

    const updates = {};
    if (name) updates.name = name;
    if (bio) updates.bio = bio;
    if (facebook_url) updates.facebook_url = facebook_url;
    if (instagram_url) updates.instagram_url = instagram_url;
    if (tiktok_url) updates.tiktok_url = tiktok_url;
    if (country) updates.country = country;
    if (language) updates.language = language;
    if (experience) updates.experience = experience;
    if (profileImage) updates.profile_image = profileImage;
    if (categories) updates.categories = JSON.stringify(categories);

    if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
    }

    const query = 'UPDATE Guides SET ? WHERE id = ?';
    db.query(query, [updates, guideId], (err, result) => {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({ error: 'Database error: ' + err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Guide not found' });
        }
        res.status(200).json({ message: 'Profile updated successfully' });
    });
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

module.exports = { getGuide, updateGuide, addPost, getPosts, addGalleryImage, getGalleryImages, deletePost, deleteGalleryImage };