# Societies Module

## Overview
A comprehensive Societies & Events management module featuring a Google Calendar-style event calendar, individual society pages, and event creation capabilities for IUT campus societies.

## Features

### 1. Event Calendar (Google Calendar Style)
- Monthly calendar view with intuitive navigation
- Sidebar filters for Society Name and Event Category
- Interactive calendar grid with color-coded event categories
- Slide-over drawer for detailed event information
- Responsive design (mobile, tablet, desktop)

### 2. Individual Society Pages
- Hero section with cover photo and society logo
- Follow/Join button with toggle functionality
- Tabbed interface: About Us, Executive Panel, Past Events Gallery
- Social media links (Facebook, Website, Email)

### 3. Event Management
- Create event modal with image upload
- Form validation for all fields
- Date pickers for event date and registration deadline
- Category selection and capacity management
- Event registration/unregistration system

## Components Structure

```
frontend/src/pages/Societies/
├── index.jsx                      # Main page with calendar/societies toggle
├── SocietyPage.jsx               # Society detail page
└── components/
    ├── EventCalendar.jsx         # Calendar view with filters
    ├── EventDrawer.jsx           # Event details slide-over panel
    ├── SocietyCard.jsx           # Society card component
    └── CreateEventModal.jsx      # Event creation form modal
```

## Routes

```jsx
/societies          →  Main societies page (calendar/grid view)
/societies/:id      →  Individual society detail page
```

## Current Societies

1. **IUT Computer Society (IUTCS)** - Technical
2. **IUT Debating Society (IUTDS)** - Cultural  
3. **IUT Career and Business Society (IUTCBS)** - Professional
4. **IUT Photography Society (IUTPS)** - Cultural

## Data Models

### Society Object
```javascript
{
  id: 1,
  name: 'Society Name',
  logo: 'url',
  coverPhoto: 'url',
  description: 'Description text',
  category: 'Technical' | 'Cultural' | 'Professional',
  memberCount: 450,
  establishedYear: 2010,
  email: 'email@iut-dhaka.edu',
  facebook: 'facebook-url',
  website: 'website-url',
  isFollowing: false,
  executivePanel: [
    {
      id: 1,
      name: 'Member Name',
      position: 'President',
      department: 'CSE',
      batch: '2021'
    }
  ],
  pastGallery: [
    {
      id: 1,
      title: 'Event Name',
      date: '2025-03-15',
      image: 'url',
      description: 'Event description with details about what happened'
    }
  ]
}
```

### Event Object
```javascript
{
  id: 1,
  title: 'Event Title',
  societyId: 1,
  societyName: 'Society Name',
  date: new Date('2026-03-15'),
  time: '10:00 AM',
  venue: 'Location',
  category: 'Workshop' | 'Competition' | 'Cultural' | 'Seminar' | 'Social',
  description: 'Event description',
  imageUrl: 'url',
  registrationDeadline: new Date('2026-03-10'),
  maxParticipants: 200,
  currentParticipants: 145,
  isRegistered: false
}
```

---

## API Documentation

### Base URL
```
http://localhost:4000/api
```

### Authentication
All authenticated endpoints require a JWT token:
```
Authorization: Bearer <token>
```

### Societies Endpoints

#### Get All Societies
```http
GET /societies
```

**Response:** `200 OK`
```json
{
  "success": true,
  "societies": [
    {
      "id": 1,
      "name": "IUT Computer Society (IUTCS)",
      "logo": "https://...",
      "coverPhoto": "https://...",
      "description": "...",
      "category": "Technical",
      "memberCount": 450,
      "establishedYear": 2010,
      "email": "iutcs@iut-dhaka.edu",
      "facebook": "https://...",
      "website": "https://...",
      "isFollowing": false
    }
  ]
}
```

#### Get Society by ID
```http
GET /societies/:id
```

**Response:** `200 OK` - Returns society with executivePanel and pastGallery arrays

#### Follow/Unfollow Society
```http
POST /societies/:id/follow
```

**Authentication:** Required

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Society followed successfully",
  "isFollowing": true
}
```

### Events Endpoints

#### Get All Events
```http
GET /events
```

**Query Parameters:**
- `societyId` (optional) - Filter by society
- `category` (optional) - Filter by category
- `month` (optional) - Filter by month (YYYY-MM)
- `upcoming` (optional) - Show only upcoming events

**Response:** `200 OK` - Returns array of events

#### Get Event by ID
```http
GET /events/:id
```

**Response:** `200 OK` - Returns event with isRegistered field

#### Create Event
```http
POST /events
```

**Authentication:** Required (Organizer role)

**Request Body:**
```json
{
  "title": "Event Title",
  "societyId": 1,
  "category": "Workshop",
  "date": "2026-03-15",
  "time": "10:00 AM",
  "venue": "IUT Auditorium",
  "description": "Event description...",
  "maxParticipants": 200,
  "registrationDeadline": "2026-03-10",
  "image": "base64_string_or_file"
}
```

**Response:** `201 Created`

#### Update Event
```http
PUT /events/:id
```

**Authentication:** Required (Organizer role, own society only)

#### Delete Event
```http
DELETE /events/:id
```

**Authentication:** Required (Organizer role, own society only)

#### Register for Event
```http
POST /events/:id/register
```

**Authentication:** Required

**Response:** `200 OK` or `400 Bad Request` (already registered/event full/registration closed)

#### Unregister from Event
```http
DELETE /events/:id/register
```

**Authentication:** Required

#### Get My Registrations
```http
GET /events/my-registrations
```

**Authentication:** Required

**Response:** Returns array of user's event registrations

### Image Upload

Use multipart/form-data for event image uploads:

```javascript
const formData = new FormData()
formData.append('title', 'Event Title')
formData.append('societyId', 1)
formData.append('image', imageFile)
// ... other fields

await axios.post('/api/events', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
    'Authorization': `Bearer ${token}`
  }
})
```

---

## Database Schema

### societies
```sql
CREATE TABLE societies (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  logo VARCHAR(500),
  cover_photo VARCHAR(500),
  description TEXT,
  category VARCHAR(50),
  established_year INTEGER,
  email VARCHAR(255),
  facebook VARCHAR(255),
  website VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### society_members
```sql
CREATE TABLE society_members (
  id SERIAL PRIMARY KEY,
  society_id INTEGER REFERENCES societies(id),
  user_id INTEGER REFERENCES users(id),
  role VARCHAR(50) DEFAULT 'member',  -- 'member', 'organizer', 'admin'
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(society_id, user_id)
);
```

### society_executives
```sql
CREATE TABLE society_executives (
  id SERIAL PRIMARY KEY,
  society_id INTEGER REFERENCES societies(id),
  name VARCHAR(255),
  position VARCHAR(100),
  department VARCHAR(50),
  batch VARCHAR(20),
  display_order INTEGER
);
```

### events
```sql
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  society_id INTEGER REFERENCES societies(id),
  category VARCHAR(50),
  date DATE NOT NULL,
  time VARCHAR(20),
  venue VARCHAR(255),
  description TEXT,
  image_url VARCHAR(500),
  max_participants INTEGER,
  registration_deadline DATE,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### event_registrations
```sql
CREATE TABLE event_registrations (
  id SERIAL PRIMARY KEY,
  event_id INTEGER REFERENCES events(id),
  user_id INTEGER REFERENCES users(id),
  registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(event_id, user_id)
);
```

### event_gallery
```sql
CREATE TABLE event_gallery (
  id SERIAL PRIMARY KEY,
  society_id INTEGER REFERENCES societies(id),
  title VARCHAR(255),
  date DATE,
  image_url VARCHAR(500),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Backend Implementation Guide

### File Structure
```
Backend/
├── controllers/
│   ├── society.controller.js
│   └── event.controller.js
├── routes/
│   ├── society.routes.js
│   └── event.routes.js
├── middleware/
│   ├── auth.middleware.js
│   └── role.middleware.js
└── models/
    ├── Society.js
    └── Event.js
```

### Example Controller (society.controller.js)
```javascript
// Get all societies
exports.getAllSocieties = async (req, res) => {
  try {
    const userId = req.user?.id // From auth middleware
    const societies = await db.query(`
      SELECT s.*, 
        COUNT(DISTINCT sm.id) as member_count,
        EXISTS(
          SELECT 1 FROM society_members 
          WHERE society_id = s.id AND user_id = $1
        ) as is_following
      FROM societies s
      LEFT JOIN society_members sm ON s.id = sm.society_id
      GROUP BY s.id
    `, [userId])
    
    res.json({ success: true, societies: societies.rows })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Get society by ID
exports.getSocietyById = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user?.id
    
    // Get society details
    const society = await db.query(`
      SELECT s.*, 
        EXISTS(
          SELECT 1 FROM society_members 
          WHERE society_id = s.id AND user_id = $1
        ) as is_following
      FROM societies s WHERE s.id = $2
    `, [userId, id])
    
    if (society.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Society not found' })
    }
    
    // Get executive panel
    const executives = await db.query(`
      SELECT * FROM society_executives 
      WHERE society_id = $1 
      ORDER BY display_order
    `, [id])
    
    // Get past gallery
    const gallery = await db.query(`
      SELECT * FROM event_gallery 
      WHERE society_id = $1 
      ORDER BY date DESC
    `, [id])
    
    const societyData = {
      ...society.rows[0],
      executivePanel: executives.rows,
      pastGallery: gallery.rows
    }
    
    res.json({ success: true, society: societyData })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Follow/Unfollow society
exports.toggleFollow = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id
    
    const existing = await db.query(`
      SELECT * FROM society_members 
      WHERE society_id = $1 AND user_id = $2
    `, [id, userId])
    
    if (existing.rows.length > 0) {
      // Unfollow
      await db.query(`
        DELETE FROM society_members 
        WHERE society_id = $1 AND user_id = $2
      `, [id, userId])
      res.json({ 
        success: true, 
        message: 'Society unfollowed', 
        isFollowing: false 
      })
    } else {
      // Follow
      await db.query(`
        INSERT INTO society_members (society_id, user_id, role) 
        VALUES ($1, $2, 'member')
      `, [id, userId])
      res.json({ 
        success: true, 
        message: 'Society followed successfully', 
        isFollowing: true 
      })
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
```

### Example Routes (society.routes.js)
```javascript
const express = require('express')
const router = express.Router()
const societyController = require('../controllers/society.controller')
const { authenticate } = require('../middleware/auth.middleware')

router.get('/societies', societyController.getAllSocieties)
router.get('/societies/:id', societyController.getSocietyById)
router.post('/societies/:id/follow', authenticate, societyController.toggleFollow)

module.exports = router
```

### Middleware Examples

#### Authentication (auth.middleware.js)
```javascript
const jwt = require('jsonwebtoken')

exports.authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      })
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Invalid token' 
    })
  }
}
```

#### Role Check (role.middleware.js)
```javascript
exports.isOrganizer = async (req, res, next) => {
  try {
    const userId = req.user.id
    const { societyId } = req.body
    
    const member = await db.query(`
      SELECT role FROM society_members 
      WHERE user_id = $1 AND society_id = $2
    `, [userId, societyId])
    
    if (member.rows.length === 0 || member.rows[0].role !== 'organizer') {
      return res.status(403).json({ 
        success: false, 
        message: 'Organizer role required' 
      })
    }
    
    next()
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
```

### Image Upload with Multer
```javascript
const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
  destination: './public/uploads/events/',
  filename: (req, file, cb) => {
    cb(null, `event-${Date.now()}${path.extname(file.originalname)}`)
  }
})

const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)
    
    if (extname && mimetype) {
      return cb(null, true)
    }
    cb('Error: Images only (jpeg, jpg, png)')
  }
})

// Use in route
router.post('/events', authenticate, isOrganizer, upload.single('image'), eventController.createEvent)
```

### Server Setup (server.js)
```javascript
const express = require('express')
const cors = require('cors')
const societyRoutes = require('./routes/society.routes')
const eventRoutes = require('./routes/event.routes')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static('public/uploads'))

app.use('/api', societyRoutes)
app.use('/api', eventRoutes)

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
```

---

## Frontend Integration

Replace mock data with API calls:

### In index.jsx:
```javascript
const fetchSocieties = async () => {
  const response = await axios.get('/api/societies')
  setSocieties(response.data.societies)
}

const fetchEvents = async () => {
  const response = await axios.get('/api/events')
  setEvents(response.data.events)
}
```

### In SocietyPage.jsx:
```javascript
const fetchSociety = async () => {
  const response = await axios.get(`/api/societies/${id}`)
  setSociety(response.data.society)
}
```

---

## Implementation Notes

### Security
1. Validate all user inputs on backend
2. Sanitize data before database queries (prevent SQL injection)
3. Use parameterized queries
4. Implement rate limiting
5. Validate file uploads (size, type, malware scan)

### Performance
1. Cache society data (Redis recommended)
2. Use database indexing on foreign keys
3. Implement pagination for events list
4. Lazy load images
5. Use CDN for static assets

### Validation
1. Check registration deadline before event date
2. Ensure max_participants > 0
3. Validate date formats
4. Check event capacity before registration
5. Verify organizer permissions for event operations

### Notifications (Recommended)
1. Email notification on event registration
2. Reminder emails 1 day before event
3. Event update notifications to registered users
4. New event announcements to society followers

---

## Testing

### API Testing with Postman
1. Set base URL: `http://localhost:4000/api`
2. Create environment variable for token
3. Test all endpoints with valid/invalid data
4. Test authentication and authorization

### Frontend Testing
```bash
cd frontend
npm run dev
```

Navigate to:
- `http://localhost:5173/societies` - Calendar view
- `http://localhost:5173/societies/1` - Society page

---

## Troubleshooting

**Events not showing in calendar**
- Check date format consistency
- Verify events are within current month
- Check filter selections

**Image upload failing**
- Verify file size < 5MB
- Check file format (PNG, JPG only)
- Ensure uploads directory exists with write permissions

**Authentication issues**
- Verify JWT token in Authorization header
- Check token expiration
- Ensure middleware is applied to protected routes

**Database connection errors**
- Check PostgreSQL connection string
- Verify database credentials
- Ensure tables are created

---

## Future Enhancements

1. Event search functionality
2. Calendar export (ICS format)
3. Email notifications system
4. Event attendance tracking
5. Society member management dashboard
6. Analytics and reporting
7. Mobile app support
8. Integration with campus announcement system

---

## Support

For issues or questions, contact the development team.
