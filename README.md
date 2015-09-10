# polydev

polydev is the Polymer DevTools Extension - a tool to help develop Polymer and
custom elements.

## Development

### Building

polydev must be built before running. The build step externalizes inline scripts
for CSP compliance, and copies some dependencies into convenient locations.

To build, run `npm run build`:

    > npm run build

The built project is available at `build/polydev`.

### Installation

 1. Create a new Chrome profile
 2. Navigate to chrome://extensions
 3. Check the "Developer mode" checkbox
 4. Click "Load unpacked extension..."
 5. Choose `/polydev/build/polydev`

### Making Changes

Because of the build step gulp must be run after changes. Depending on the
change you can either then close and reopen the devtools, or if you've made a
change to the content-script or to element-zones, you must reload both the
extension and any page you're testing it on.

### Working on element-zones

polydev uses the element-zones library to capture custom element stats. If you
want to work on element-zones and see the results in polydev, then:

 1. Run `bower link` in the element-zones directory
 2. Run `bower link element-zones` in the polydev directory
 3. Run `gulp` as normal
