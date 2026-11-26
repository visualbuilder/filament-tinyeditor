# Changelog

All notable changes to `filament-tinyeditor` will be documented in this file.

## [6.2.0] - 2026-11-26

### Added
- `dispatchDroppedFiles(bool | Closure $condition = true)` announces files dragged over or dropped on the body as `tinyeditor-file-dragover` / `tinyeditor-files-dropped` window events instead of inserting them. Text and links still drop normally.
- The view passes `dispatch_dropped_files` to the Alpine component. An app that publishes `tiny-editor.blade.php` must add it to its copy.

### Fixed
- An image or selection dragged within the body is no longer treated as a dropped file. `allowFileDrop(false)` blocked the move when the browser added a File to the drag; a drag that starts in the body now always drops normally.

## [6.1.0] - 2026-11-25

### Fixed
- A pasted image uploads on Filament 5. The upload handler called `getFormComponentFileAttachmentUrl()`, a Filament 3 Livewire method that no longer exists, so Livewire answered 419 ("page expired"). It now calls `callSchemaComponentMethod(key, 'saveUploadedFileAttachmentAndGetUrl')`.
- A failed upload shows a message in the editor and removes the image. The error callback was empty.
- With `preferPastedImageFiles()` on, a clipboard image that cannot be read shows a message in the editor. The paste used to be lost with no image and no message.

### Changed
- Image paste and file uploads are off unless the field calls `->fileAttachments(true)` (`hasFileAttachmentsByDefault()` returns `false`). With them off, TinyMCE gets `paste_data_images: false` and `automatic_uploads: false`, and no upload handler. Uploads failed on every earlier 6.x release, so no working behaviour is lost.
- The browser refuses an image whose type is not in `fileAttachmentsAcceptedFileTypes()` or that is larger than `fileAttachmentsMaxSize()` before it uploads. Filament still validates both on the server.

### Added
- `allowFileDrop(bool | Closure $condition = true)`: pass `false` and a file dropped on the body is not inserted. Text and links still drop normally.
- `preferPastedImageFiles(bool | Closure $condition = true)`: when the clipboard holds an image file next to HTML that is only an `<img>` (Teams, browsers), the editor uploads the file instead of inserting the remote `<img>`.
- The view passes `component_key`, `file_attachments`, `file_attachments_accepted_types`, `file_attachments_max_size`, `allow_file_drop` and `prefer_pasted_image_files` to the Alpine component. An app that publishes `tiny-editor.blade.php` must add them to its copy.

## [6.0.1] - 2026-09-28

### Added
- The editor follows Filament's light/dark switch without a reload: pass `skin_dark`, `content_css_dark`, `skin_light` and `content_css_light` to the Alpine component and it re-initialises on the `theme-changed` window event, keeping its content. `initEditor` now reads the skin from component state. The listener is removed in Alpine's `destroy()`.

## [5.0.0] - 2026-03-31

### Added
- Filament 5.x compatibility
- Livewire 4.x support
- Pest 4.x test framework support
- PHPUnit 12.x support
- Laravel 13.x compatibility
- Comprehensive Filament 5 compatibility test suite
- Detailed compatibility report documentation

### Changed
- Updated `filament/filament` dependency from `^4.0` to `^5.0`
- Updated `pestphp/pest` from `^3.0` to `^4.0`
- Updated `pestphp/pest-plugin-laravel` from `^3.0` to `^4.0`
- Added `phpunit/phpunit` `^12.0` to dev dependencies

### Migration Notes
- **No source code changes required** - Package is fully compatible with Filament 5
- All existing Filament 4 code continues to work without modifications
- Upgrade is as simple as updating `composer.json` and running `composer update`
- No breaking changes in package API
- All form field methods remain unchanged

### Technical Details
- Package does NOT use `Filament\Schemas` namespace (Filament 4 specific)
- Uses only stable Filament APIs (Forms, Components, Support)
- No Livewire v4 breaking changes required
- Standard form field patterns remain fully compatible
- Asset registration API unchanged

## [4.x] - Previous Releases

See git history for details on 4.x releases.
