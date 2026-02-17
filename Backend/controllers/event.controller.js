const Event = require('../models/Event');
const Society = require('../models/Society');

// Get all events
exports.getAllEvents = async (req, res) => {
  try {
    const { societyId, category, month, upcoming } = req.query;
    
    let query = {};
    
    if (societyId) {
      query.societyId = societyId;
    }
    
    if (category) {
      query.category = category;
    }
    
    if (month) {
      // month format: YYYY-MM
      const [year, monthNum] = month.split('-');
      const startDate = new Date(year, monthNum - 1, 1);
      const endDate = new Date(year, monthNum, 0);
      query.date = { $gte: startDate, $lte: endDate };
    }
    
    if (upcoming === 'true') {
      query.date = { $gte: new Date() };
    }
    
    const events = await Event.find(query).sort({ date: 1 }).select('-__v');
    
    const eventsWithDetails = events.map(event => ({
      ...event.toObject(),
      currentParticipants: event.registrations.length,
      isRegistered: false // TODO: Check against logged-in user
    }));
    
    res.status(200).json({
      success: true,
      events: eventsWithDetails
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching events',
      error: error.message
    });
  }
};

// Get event by ID
exports.getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id).select('-__v');
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    const eventData = {
      ...event.toObject(),
      currentParticipants: event.registrations.length,
      isRegistered: false // TODO: Check against logged-in user
    };
    
    res.status(200).json({
      success: true,
      event: eventData
    });
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching event',
      error: error.message
    });
  }
};

// Create event
exports.createEvent = async (req, res) => {
  try {
    const {
      title,
      societyId,
      category,
      date,
      time,
      venue,
      description,
      imageUrl,
      maxParticipants,
      registrationDeadline,
      userEmail // TODO: Get from auth token
    } = req.body;
    
    if (!userEmail) {
      return res.status(400).json({
        success: false,
        message: 'User email is required'
      });
    }
    
    // Verify society exists and user is admin
    const society = await Society.findById(societyId);
    if (!society) {
      return res.status(404).json({
        success: false,
        message: 'Society not found'
      });
    }
    
    // Check if user is admin
    if (!society.admins.includes(userEmail)) {
      return res.status(403).json({
        success: false,
        message: 'Only admins can create events for this society'
      });
    }
    
    const event = new Event({
      title,
      societyId,
      societyName: society.name,
      category,
      date,
      time,
      venue,
      description,
      imageUrl,
      maxParticipants,
      registrationDeadline,
      registrations: [],
      createdBy: userEmail
    });
    
    await event.save();
    
    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      event: {
        ...event.toObject(),
        currentParticipants: 0
      }
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating event',
      error: error.message
    });
  }
};

// Update event
exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Remove fields that shouldn't be updated directly
    delete updates.registrations;
    delete updates.createdBy;
    delete updates._id;
    delete updates.__v;
    delete updates.createdAt;
    delete updates.updatedAt;
    delete updates.societyId;
    
    const event = await Event.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      event
    });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating event',
      error: error.message
    });
  }
};

// Delete event
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    
    const event = await Event.findByIdAndDelete(id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting event',
      error: error.message
    });
  }
};

// Register for event
exports.registerForEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { userEmail } = req.body; // TODO: Get from auth token
    
    if (!userEmail) {
      return res.status(400).json({
        success: false,
        message: 'User email is required'
      });
    }
    
    const event = await Event.findById(id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    // Check if already registered
    if (event.registrations.includes(userEmail)) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered for this event'
      });
    }
    
    // Check if event is full
    if (event.registrations.length >= event.maxParticipants) {
      return res.status(400).json({
        success: false,
        message: 'Event is fully booked'
      });
    }
    
    // Check if registration deadline has passed
    if (new Date() > new Date(event.registrationDeadline)) {
      return res.status(400).json({
        success: false,
        message: 'Registration deadline has passed'
      });
    }
    
    event.registrations.push(userEmail);
    await event.save();
    
    res.status(200).json({
      success: true,
      message: 'Successfully registered for event'
    });
  } catch (error) {
    console.error('Error registering for event:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering for event',
      error: error.message
    });
  }
};

// Unregister from event
exports.unregisterFromEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { userEmail } = req.body; // TODO: Get from auth token
    
    if (!userEmail) {
      return res.status(400).json({
        success: false,
        message: 'User email is required'
      });
    }
    
    const event = await Event.findById(id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    event.registrations = event.registrations.filter(email => email !== userEmail);
    await event.save();
    
    res.status(200).json({
      success: true,
      message: 'Successfully unregistered from event'
    });
  } catch (error) {
    console.error('Error unregistering from event:', error);
    res.status(500).json({
      success: false,
      message: 'Error unregistering from event',
      error: error.message
    });
  }
};
