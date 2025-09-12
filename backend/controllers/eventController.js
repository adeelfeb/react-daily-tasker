import Event from '../models/Event.js';

// @desc    Get public events (no auth required)
// @route   GET /api/events/public
// @access  Public
export const getPublicEvents = async (req, res) => {
  try {
    const { city } = req.query;
    let query = { isPublic: true };
    
    if (city) {
      query.city = city;
    }
    
    const events = await Event.find(query)
      .select('-attendees')
      .populate('createdBy', 'name')
      .sort({ start: 1 });

    res.json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
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
    const { start, end, type, status, city } = req.query;
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

    // Add city filter
    if (city) {
      query.city = city;
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
    console.log('Create event - Request body:', req.body);
    console.log('Create event - Request file:', req.file);
    
    const eventData = {
      ...req.body,
      createdBy: req.user.id
    };

    // Convert string boolean values back to boolean
    if (eventData.allDay === 'true') {
      eventData.allDay = true;
    } else if (eventData.allDay === 'false') {
      eventData.allDay = false;
    }

    // Add image URL if image was uploaded
    if (req.file) {
      eventData.imageUrl = req.file.path;
    }

    console.log('Event data to create:', eventData);
    const event = await Event.create(eventData);
    
    await event.populate('createdBy', 'name email');
    await event.populate('attendees', 'name email');

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: event
    });
  } catch (error) {
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

    // Validate dates using the effective values (existing or incoming)
    const effectiveStart = req.body.start ? new Date(req.body.start) : new Date(event.start);
    const effectiveEnd = req.body.end ? new Date(req.body.end) : new Date(event.end);

    if (Number.isNaN(effectiveStart.getTime())) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation failed',
        errors: [{ field: 'start', message: 'Start date must be a valid date' }]
      });
    }
    if (Number.isNaN(effectiveEnd.getTime())) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation failed',
        errors: [{ field: 'end', message: 'End date must be a valid date' }]
      });
    }
    if (effectiveEnd <= effectiveStart) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation failed',
        errors: [{ field: 'end', message: 'End date must be after start date' }]
      });
    }

    // Apply updates on the loaded document and save so validators run with proper context
    const updatableFields = [
      'title', 'description', 'start', 'end', 'type', 'location', 'city',
      'allDay', 'attendees', 'isPublic', 'status', 'recurring', 'imageUrl'
    ];
    updatableFields.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        let value = req.body[field];
        // Convert string boolean values back to boolean
        if (field === 'allDay') {
          if (value === 'true') value = true;
          else if (value === 'false') value = false;
        }
        event.set(field, value);
      }
    });

    // Add image URL if new image was uploaded
    if (req.file) {
      event.set('imageUrl', req.file.path);
    }

    await event.save();

    await event.populate('createdBy', 'name email');
    await event.populate('attendees', 'name email');

    // align variable name for response
    

    res.json({
      success: true,
      message: 'Event updated successfully',
      data: event
    });
  } catch (error) {
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
    res.status(500).json({
      success: false,
      message: 'Server error while fetching events by range'
    });
  }
};
