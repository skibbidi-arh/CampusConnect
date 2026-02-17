const Society = require('../models/Society');

// Get all societies
exports.getAllSocieties = async (req, res) => {
  try {
    const societies = await Society.find().select('-__v');
    
    const societiesWithCount = societies.map(society => ({
      ...society.toObject(),
      memberCount: society.followers.length,
      isFollowing: false, // TODO: Check against logged-in user
      isAdmin: false // TODO: Check against logged-in user
    }));
    
    res.status(200).json({
      success: true,
      societies: societiesWithCount
    });
  } catch (error) {
    console.error('Error fetching societies:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching societies',
      error: error.message
    });
  }
};

// Get society by ID
exports.getSocietyById = async (req, res) => {
  try {
    const { id } = req.params;
    const { userEmail } = req.query;
    const society = await Society.findById(id).select('-__v');
    
    if (!society) {
      return res.status(404).json({
        success: false,
        message: 'Society not found'
      });
    }
    
    const isFollowing = userEmail ? society.followers.includes(userEmail) : false;
    const isAdmin = userEmail ? society.admins.includes(userEmail) : false;
    
    const societyData = {
      ...society.toObject(),
      memberCount: society.followers.length,
      isFollowing,
      isAdmin
    };
    
    res.status(200).json({
      success: true,
      society: societyData
    });
  } catch (error) {
    console.error('Error fetching society:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching society',
      error: error.message
    });
  }
};

// Create a new society
exports.createSociety = async (req, res) => {
  try {
    const {
      name,
      logo,
      coverPhoto,
      description,
      category,
      establishedYear,
      email,
      facebook,
      website
    } = req.body;
    
    // Check if society already exists
    const existingSociety = await Society.findOne({ name });
    if (existingSociety) {
      return res.status(400).json({
        success: false,
        message: 'Society with this name already exists'
      });
    }
    
    const society = new Society({
      name,
      logo,
      coverPhoto,
      description,
      category,
      establishedYear,
      email,
      facebook,
      website,
      panelMembers: [],
      pastGallery: [],
      admins: [],
      followers: []
    });
    
    await society.save();
    
    res.status(201).json({
      success: true,
      message: 'Society created successfully',
      society
    });
  } catch (error) {
    console.error('Error creating society:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating society',
      error: error.message
    });
  }
};

// Update society information
exports.updateSociety = async (req, res) => {
  try {
    const { id } = req.params;
    const { userEmail, ...updates } = req.body;
    
    // Verify user is an admin
    const society = await Society.findById(id);
    if (!society) {
      return res.status(404).json({
        success: false,
        message: 'Society not found'
      });
    }
    
    if (userEmail && !society.admins.includes(userEmail)) {
      return res.status(403).json({
        success: false,
        message: 'Only admins can update society information'
      });
    }
    
    // Remove fields that shouldn't be updated directly
    delete updates.admins;
    delete updates.followers;
    delete updates._id;
    delete updates.__v;
    delete updates.createdAt;
    delete updates.updatedAt;
    
    const updatedSociety = await Society.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      message: 'Society updated successfully',
      society: updatedSociety
    });
  } catch (error) {
    console.error('Error updating society:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating society',
      error: error.message
    });
  }
};

// Follow/Unfollow society
exports.toggleFollow = async (req, res) => {
  try {
    const { id } = req.params;
    const { userEmail } = req.body; // TODO: Get from auth token
    
    if (!userEmail) {
      return res.status(400).json({
        success: false,
        message: 'User email is required'
      });
    }
    
    const society = await Society.findById(id);
    
    if (!society) {
      return res.status(404).json({
        success: false,
        message: 'Society not found'
      });
    }
    
    const isFollowing = society.followers.includes(userEmail);
    
    if (isFollowing) {
      // Unfollow
      society.followers = society.followers.filter(email => email !== userEmail);
      await society.save();
      
      res.status(200).json({
        success: true,
        message: 'Unfollowed society',
        isFollowing: false
      });
    } else {
      // Follow
      society.followers.push(userEmail);
      await society.save();
      
      res.status(200).json({
        success: true,
        message: 'Following society',
        isFollowing: true
      });
    }
  } catch (error) {
    console.error('Error toggling follow:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling follow',
      error: error.message
    });
  }
};

// Join as admin
exports.joinAsAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { userEmail } = req.body; // TODO: Get from auth token
    
    if (!userEmail) {
      return res.status(400).json({
        success: false,
        message: 'User email is required'
      });
    }
    
    const society = await Society.findById(id);
    
    if (!society) {
      return res.status(404).json({
        success: false,
        message: 'Society not found'
      });
    }
    
    const isAdmin = society.admins.includes(userEmail);
    
    if (isAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Already an admin of this society'
      });
    }
    
    society.admins.push(userEmail);
    await society.save();
    
    res.status(200).json({
      success: true,
      message: 'Successfully joined as admin',
      isAdmin: true
    });
  } catch (error) {
    console.error('Error joining as admin:', error);
    res.status(500).json({
      success: false,
      message: 'Error joining as admin',
      error: error.message
    });
  }
};

// Leave admin role
exports.leaveAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { userEmail } = req.body; // TODO: Get from auth token
    
    if (!userEmail) {
      return res.status(400).json({
        success: false,
        message: 'User email is required'
      });
    }
    
    const society = await Society.findById(id);
    
    if (!society) {
      return res.status(404).json({
        success: false,
        message: 'Society not found'
      });
    }
    
    society.admins = society.admins.filter(email => email !== userEmail);
    await society.save();
    
    res.status(200).json({
      success: true,
      message: 'Left admin role',
      isAdmin: false
    });
  } catch (error) {
    console.error('Error leaving admin:', error);
    res.status(500).json({
      success: false,
      message: 'Error leaving admin',
      error: error.message
    });
  }
};

// Add panel member
exports.addPanelMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { userEmail, name, position, department, batch } = req.body;
    
    const society = await Society.findById(id);
    
    if (!society) {
      return res.status(404).json({
        success: false,
        message: 'Society not found'
      });
    }
    
    // Verify user is an admin
    if (userEmail && !society.admins.includes(userEmail)) {
      return res.status(403).json({
        success: false,
        message: 'Only admins can add panel members'
      });
    }
    
    society.panelMembers.push({ name, position, department, batch });
    await society.save();
    
    res.status(200).json({
      success: true,
      message: 'Panel member added',
      society
    });
  } catch (error) {
    console.error('Error adding panel member:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding panel member',
      error: error.message
    });
  }
};

// Update panel member
exports.updatePanelMember = async (req, res) => {
  try {
    const { id, memberId } = req.params;
    const { userEmail, name, position, department, batch } = req.body;
    
    const society = await Society.findById(id);
    
    if (!society) {
      return res.status(404).json({
        success: false,
        message: 'Society not found'
      });
    }
    
    // Verify user is an admin
    if (userEmail && !society.admins.includes(userEmail)) {
      return res.status(403).json({
        success: false,
        message: 'Only admins can update panel members'
      });
    }
    
    const member = society.panelMembers.id(memberId);
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Panel member not found'
      });
    }
    
    member.name = name || member.name;
    member.position = position || member.position;
    member.department = department || member.department;
    member.batch = batch || member.batch;
    
    await society.save();
    
    res.status(200).json({
      success: true,
      message: 'Panel member updated',
      society
    });
  } catch (error) {
    console.error('Error updating panel member:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating panel member',
      error: error.message
    });
  }
};

// Delete panel member
exports.deletePanelMember = async (req, res) => {
  try {
    const { id, memberId } = req.params;
    const { userEmail } = req.body;
    
    const society = await Society.findById(id);
    
    if (!society) {
      return res.status(404).json({
        success: false,
        message: 'Society not found'
      });
    }
    
    // Verify user is an admin
    if (userEmail && !society.admins.includes(userEmail)) {
      return res.status(403).json({
        success: false,
        message: 'Only admins can delete panel members'
      });
    }
    
    const member = society.panelMembers.id(memberId);
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Panel member not found'
      });
    }
    
    member.deleteOne();
    await society.save();
    
    res.status(200).json({
      success: true,
      message: 'Panel member deleted',
      society
    });
  } catch (error) {
    console.error('Error deleting panel member:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting panel member',
      error: error.message
    });
  }
};


// Add past event to gallery
exports.addPastEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { userEmail, title, date, image, description } = req.body;
    
    const society = await Society.findById(id);
    
    if (!society) {
      return res.status(404).json({
        success: false,
        message: 'Society not found'
      });
    }
    
    // Verify user is an admin
    if (userEmail && !society.admins.includes(userEmail)) {
      return res.status(403).json({
        success: false,
        message: 'Only admins can add past events'
      });
    }
    
    society.pastGallery.push({ title, date, image, description });
    await society.save();
    
    res.status(200).json({
      success: true,
      message: 'Past event added',
      society
    });
  } catch (error) {
    console.error('Error adding past event:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding past event',
      error: error.message
    });
  }
};

// Update past event
exports.updatePastEvent = async (req, res) => {
  try {
    const { id, eventId } = req.params;
    const { userEmail, title, date, image, description } = req.body;
    
    const society = await Society.findById(id);
    
    if (!society) {
      return res.status(404).json({
        success: false,
        message: 'Society not found'
      });
    }
    
    // Verify user is an admin
    if (userEmail && !society.admins.includes(userEmail)) {
      return res.status(403).json({
        success: false,
        message: 'Only admins can update past events'
      });
    }
    
    const event = society.pastGallery.id(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Past event not found'
      });
    }
    
    event.title = title || event.title;
    event.date = date || event.date;
    event.image = image || event.image;
    event.description = description !== undefined ? description : event.description;
    
    await society.save();
    
    res.status(200).json({
      success: true,
      message: 'Past event updated',
      society
    });
  } catch (error) {
    console.error('Error updating past event:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating past event',
      error: error.message
    });
  }
};

// Delete past event
exports.deletePastEvent = async (req, res) => {
  try {
    const { id, eventId } = req.params;
    const { userEmail } = req.body;
    
    const society = await Society.findById(id);
    
    if (!society) {
      return res.status(404).json({
        success: false,
        message: 'Society not found'
      });
    }
    
    // Verify user is an admin
    if (userEmail && !society.admins.includes(userEmail)) {
      return res.status(403).json({
        success: false,
        message: 'Only admins can delete past events'
      });
    }
    
    const event = society.pastGallery.id(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Past event not found'
      });
    }
    
    event.deleteOne();
    await society.save();
    
    res.status(200).json({
      success: true,
      message: 'Past event deleted',
      society
    });
  } catch (error) {
    console.error('Error deleting past event:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting past event',
      error: error.message
    });
  }
};
