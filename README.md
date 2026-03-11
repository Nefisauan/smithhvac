# Smith HVAC Website

Professional, conversion-focused HVAC website for smithhvacservice.com

## Deploy to GitHub Pages

1. Push this repo to GitHub
2. Go to **Settings → Pages**
3. Set source to **main branch / root**
4. Add your custom domain: `smithhvacservice.com`
5. Add a CNAME record with your domain registrar pointing to `nefisauan.github.io`

## Adding Videos

Replace the placeholder video cards in `index.html` with real embeds:

**YouTube embed:**
```html
<iframe width="100%" height="100%" src="https://www.youtube.com/embed/VIDEO_ID"
  frameborder="0" allowfullscreen></iframe>
```

## Contact Form

The form currently shows a success message (demo). To make it actually send emails, use one of these free services:
- **Formspree**: Add `action="https://formspree.io/f/YOUR_ID"` to the form and remove `e.preventDefault()`
- **Netlify Forms**: Add `data-netlify="true"` to the form tag (if hosting on Netlify)
- **EmailJS**: Free email sending via JavaScript

## Files

- `index.html` — Full website (single page)
- `css/style.css` — All styles
- `js/main.js` — Calculator, FAQ, nav, animations
- `images/` — Add photos here
- `videos/` — Add video files here
