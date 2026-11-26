---
platforms: [windows]
---
# Settings & Personalization

LeviLauncher includes a comprehensive settings area for configuring paths, appearance, package management, privacy choices, and update behavior.

## Main settings sections

Settings are grouped into several sections, including:

- Basic Settings
- Personalization
- Package Management
- Others
- Privacy
- Updates
- About

## What you can adjust

### Paths and storage

- base content path
- writable location for managed files
- environment placement that suits your disk layout

### Appearance

- language
- light or dark preference
- theme color behavior
- background and visual personalization options

#### Wallpaper and interface material

Choose an image folder under **Personalization → Wallpaper → Background Image**, then open **Personalization → Materials and readability** to adjust **Interface material**, the layer between the wallpaper and your content. Navigation, cards, tabs, form controls, and popup surfaces share a single material system. Light and dark profiles are saved separately and switch automatically with the app theme; the **Light Mode** / **Dark Mode** buttons in the material editor only select which profile to edit and preview.

| Setting | Behavior |
| --- | --- |
| Balanced | Default preset: soft glass with readability protection turned on |
| Clear | More wallpaper shows through the cards, with readability protection turned off; best with simple, low-contrast images |
| Solid | Opaque cards without card blur; wallpaper remains visible outside cards |
| Interface opacity | Changes neutral interface surface tints without fading text, icons, or buttons |
| Interface blur | Controls blur behind panels, navigation, and popup surfaces; image blur affects the entire wallpaper |
| Wallpaper overlay | Softens the wallpaper with a light tint in light mode and a dark tint in dark mode, independent of image brightness and opacity |
| Readability protection | Applies a conservative minimum tint based on theme, brightness, image opacity, and blur, and strengthens secondary text |

The live preview shares the loaded image and rendering parameters with the main window. When protection increases the effective card opacity, the editor shows the applied value. This calculation neither analyzes nor uploads the image. **Reset this theme** restores only the material profile currently being edited; it does not clear the image folder or affect the other theme's profile.

Use **Next image** when the folder contains multiple pictures. **Sequential** order uses natural filename sorting, while **Random** order avoids repeating the current image. If no image is selected, the image fails to load, or image opacity is 0, the interface falls back to standard surfaces. Higher contrast, reduced transparency, and unsupported backdrop filters use solid fallback surfaces.

### Package Management

- built-in package manager (compatible with [lip](https://github.com/LiteLDev/lip); nothing to install or update): use **Clean Cache** to remove downloaded package files if package downloads fail
- **Use mirror sources**: download launcher updates, packages, and version lists from mirrors hosted in mainland China (on by default for users in mainland China)
- **GitHub proxy** used for package downloads (shown while **Use mirror sources** is on): pick a preset or choose **Custom** to enter your own URL; leave it empty to restore the default

### Privacy

- usage analytics (Google Analytics), which you can turn off at any time
- links to the Google Analytics terms and Google privacy policy

### Updates

- update checks
- **Receive Beta Updates** to get prerelease launcher updates

## Recommended defaults

- keep managed files on a writable drive with enough free space
- leave **Receive Beta Updates** off unless you want prerelease launcher builds
- customize the appearance only after confirming that your base setup works properly

## When to review settings

Review your settings whenever you:

- move your installation to another drive
- see write permission errors
- want separate personalization per machine
- need to troubleshoot downloads or component detection
