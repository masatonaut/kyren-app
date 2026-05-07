# PWA Icons

Generate icons from `public/og.png`:

```bash
# Using ImageMagick (install: brew install imagemagick)
cd sabaku
magick public/og.png -resize 192x192 public/icons/icon-192.png
magick public/og.png -resize 512x512 public/icons/icon-512.png
```

Or use a placeholder (until real icons are designed):

```bash
cp public/og.png public/icons/icon-192.png
cp public/og.png public/icons/icon-512.png
```

Then `git add public/icons/` and commit.
