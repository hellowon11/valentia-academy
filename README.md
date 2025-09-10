# Valentia Cabin Crew Academy

A modern, multilingual website for Valentia Cabin Crew Academy featuring course information, team profiles, and contact forms.

## Features

- 🌐 Multi-language support (English, Chinese, Korean, Japanese)
- 📱 Fully responsive design
- ✈️ Course information and applications
- 👥 Team member profiles
- 📧 Contact forms with email functionality
- 🗺️ Google Maps integration
- 📱 Mobile-optimized UI/UX

## Tech Stack

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Email**: Nodemailer
- **Maps**: Google Maps API
- **Deployment**: Vercel

## Environment Variables

Create a `.env.local` file in the root directory with:

```env
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Google Maps API Key
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# Server Configuration
PORT=3001
NODE_ENV=production
```

## Deployment to Vercel

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

The site will be available at `your-project-name.vercel.app`

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Contact

For questions about this project, contact: valentiacabincrew.academy@gmail.com
