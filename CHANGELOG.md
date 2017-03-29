# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

<!--## Unreleased-->

<!--
  New PRs should document their changes here, uncommenting the Unreleased
  header as necessary.
-->

## [0.0.8] - 2016-03-23

* Fix measurement of v1 Custom Elements. Had to drop support for measuring v1 element creation, at least for the moment.

## [0.0.7] - 2016-11-17

* Redesigned polydev around minimally patching custom element APIs and exposing the timings via the [user timing APIs](https://www.html5rocks.com/en/tutorials/webperformance/usertiming/).

## [0.0.5] - 2016-09-15

### Changed
* Left-align time bars
* Use a sourceURL to clarify the source of the injected code.
* Draw a table with in-cell bar charts to quickly visualize where the work is going.

### Fixed
* Updated CSS parser to fix several parse bugs. See https://github.com/PolymerLabs/shady-css-parser/releases/tag/v0.0.8

## [0.0.4] - 2016-09-14

### Added
* Add ability to reset stats.

## [0.0.3] - 2016-09-09

### Added
* Track and display Polymer data-binding time.
* Misc improvements to tracking and visualization.
