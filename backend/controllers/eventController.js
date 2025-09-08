import Event from '../models/Event.js';

// @desc    Get public events (no auth required)
// @route   GET /api/events/public
// @access  Public
export const getPublicEvents = async (req, res) => {
  try {
    const events = await Event.find({ isPublic: true })
      .select('-attendees')
      .populate('createdBy', 'name')
      .sort({ start: 1 });

    res.json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    console.error('Get public events error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching public events'
    });
  }
};

// @desc    Get all events
// @route   GET /api/events
// @access  Private
export const getEvents = async (req, res) => {
  try {
    const { start, end, type, status } = req.query;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Build query
    let query = {};

    // If user is not admin, only show public events or events they created
    if (userRole !== 'admin') {
      query = {
        $or: [
          { isPublic: true },
          { createdBy: userId }
        ]
      };
    }

    // Add date range filter
    if (start && end) {
      query.start = {
        $gte: new Date(start),
        $lte: new Date(end)
      };
    }

    // Add type filter
    if (type) {
      query.type = type;
    }

    // Add status filter
    if (status) {
      query.status = status;
    }

    const events = await Event.find(query)
      .populate('createdBy', 'name email')
      .populate('attendees', 'name email')
      .sort({ start: 1 });

    res.json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching events'
    });
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Private
export const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('attendees', 'name email');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user can access this event
    const userId = req.user.id;
    const userRole = req.user.role;
    
    if (userRole !== 'admin' && 
        event.createdBy._id.toString() !== userId && 
        !event.isPublic) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this event'
      });
    }

    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching event'
    });
  }
};

// @desc    Create new event
// @route   POST /api/events
// @access  Private
export const createEvent = async (req, res) => {
  try {
    const eventData = {
      ...req.body,
      createdBy: req.user.id
    };

    const event = await Event.create(eventData);
    
    await event.populate('createdBy', 'name email');
    await event.populate('attendees', 'name email');

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: event
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating event'
    });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private
export const updateEvent = async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user can update this event
    const userId = req.user.id;
    const userRole = req.user.role;
    
    if (userRole !== 'admin' && event.createdBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only update your own events'
      });
    }

    event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email')
     .populate('attendees', 'name email');

    res.json({
      success: true,
      message: 'Event updated successfully',
      data: event
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating event'
    });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user can delete this event
    const userId = req.user.id;
    const userRole = req.user.role;
    
    if (userRole !== 'admin' && event.createdBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only delete your own events'
      });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting event'
    });
  }
};

// @desc    Get events by date range
// @route   GET /api/events/range/:start/:end
// @access  Private
export const getEventsByRange = async (req, res) => {
  try {
    const { start, end } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    let query = {
      start: {
        $gte: new Date(start),
        $lte: new Date(end)
      }
    };

    // If user is not admin, only show public events or events they created
    if (userRole !== 'admin') {
      query = {
        ...query,
        $or: [
          { isPublic: true },
          { createdBy: userId }
        ]
      };
    }

    const events = await Event.find(query)
      .populate('createdBy', 'name email')
      .populate('attendees', 'name email')
      .sort({ start: 1 });

    res.json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    console.error('Get events by range error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching events by range'
    });
  }
};
