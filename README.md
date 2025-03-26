# Palbin Tools

## Description
Palbin Tools is a comprehensive web application that provides a collection of useful tools for content creation and management. The platform includes various utilities designed to help users with different aspects of content creation and processing.

## Features
- Instagram Grid Maker: Create and customize Instagram grid layouts
- Thread Generator: Generate social media threads
- Image Compressor: Optimize and compress images
- Invoice Generator: Create professional invoices
- Documentation Tools: Generate and manage documentation

## Technologies
- **Frontend Framework**: Next.js 15.2.3
- **Language**: TypeScript
- **UI Libraries**: 
  - React 18
  - React Bootstrap
  - Bootstrap 5.3.3
- **Additional Libraries**:
  - PDF Generation: @react-pdf/renderer
  - Image Processing: html2canvas, jspdf
  - File Handling: jszip, file-saver
  - Form Validation: zod
  - Internationalization: i18n-iso-countries
  - AI Integration: @ai-sdk/openai

## Prerequisites
- Node.js (Latest LTS version recommended)
- npm (comes with Node.js)

## Installation
1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd palbin-tools
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Configure the required environment variables

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint
- `npm run export`: Export static site

## Project Structure
```
palbin-tools/
├── app/                    # Next.js app directory
│   ├── components/        # Reusable components
│   ├── styles/           # Global styles
│   ├── api/              # API routes
│   ├── tools/            # Individual tool pages
│   └── data/             # Static data
├── public/               # Static assets
└── package.json          # Project dependencies
```

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is licensed under the MIT License - see the LICENSE file for details.