# Release Notes for Promptly

## 1.2.0 - 2023-08-30
### Added
- Support for both Plain Text and [CKEditor](https://plugins.craftcms.com/ckeditor) fields
- Ability to enable/disable Promptly on a per-field basis

### Changed
- Promptly no longer requires a plugin integration with [Redactor](https://plugins.craftcms.com/redactor)

> **Note**
> You should remove `"promptly"` from your redactor configs and delete `config/redactor/plugins/promptly.js`

## 1.1.1 - 2023-07-18
### Fixed
- Missing feedback for empty content blocks in some cases.

## 1.1.0 - 2023-07-18
### Fixed
- Instance where returned OpenAI errors were not being displayed
- Redirecting users to action endpoint when logging into dashboard

### Added
- Optional Organization ID config for users who belong to multiple organizations

### Changed
- Front and back end refactoring and tighter integration with Craft utilities

## 1.0.2 - 2023-06-06
### Fixed
- Cases where the generate button was not showing as expected
- OpenAI error responses not being handled correctly

### Changed
- Slightly adjusted Correct Spelling & Grammar prompt
- Remove @microsoft/fetch-event-source dependency

## 1.0.1 - 2023-05-29
### Fixed
- Added check for cases where tables were not created in the database on install
