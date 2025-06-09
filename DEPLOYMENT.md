
# Production Deployment Guide

## Vercel Deployment Setup

### 1. Environment Variables
Set these environment variables in Vercel dashboard:

```
VITE_API_URL=https://your-backend-url.com
VITE_OPENAI_API_KEY=sk-your-openai-api-key-here
VITE_ENV=production
```

### 2. Build Configuration
The project is configured with Vite and should build automatically on Vercel.

Build command: `npm run build`
Output directory: `dist`

### 3. Features Ready for Production

#### ✅ Working Features:
- Homepage with responsive design
- About Us page
- Services page
- Countries/Destinations page
- Contact Us page with Google Maps
- AI Chat system with fallback responses
- Privacy Policy, Terms of Service, Cookies Policy
- Consultation booking form (frontend only)

#### ⚠️ Development Features (Not Production Ready):
- Student portal (authentication required)
- Admin portal (authentication required)
- Processing team portal (authentication required)
- Backend API integration
- Real-time chat with OpenAI (requires API key)

### 4. Production Branch Strategy

Create a production branch with:
```bash
git checkout -b production
git push origin production
```

Set Vercel to deploy from the `production` branch for stable releases.

### 5. Security Considerations

- OpenAI API key is secured in environment variables
- Fallback responses work when API key is not configured
- No sensitive data exposed in client-side code
- CORS properly configured for production

### 6. Post-Deployment Checklist

- [ ] Verify all pages load correctly
- [ ] Test contact form submission
- [ ] Test consultation booking form
- [ ] Verify AI chat works (with or without API key)
- [ ] Check mobile responsiveness
- [ ] Test all navigation links
- [ ] Verify Google Maps integration
- [ ] Test image loading for all destinations

### 7. Future Development

Continue development on `main` branch while keeping `production` stable:
- Implement backend authentication
- Add real student/admin portals
- Integrate payment systems
- Add real-time features
