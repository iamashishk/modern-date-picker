# Modern Date Picker

A modern, responsive date picker for single-date and date-range selection.

[Demo](demo)

## Installation

### NPM
```bash
npm install modern-date-picker
```

### CDN
```html
<script src="https://cdn.jsdelivr.net/gh/iamashishk/modern-date-picker@latest/dist/modern-date-picker.min.js"></script>
```

## Feature Overview

- Single date and date range modes
- Min/max date boundaries
- First-open month anchoring with `monthView` (`start` or `end`)
- Dynamic month count with `monthsToShow`
- Preset date pills (`presets`) with custom labels and ranges
- Auto-apply or manual apply flow
- Timezone-aware parsing and formatting
- Keyboard-friendly day selection
- Responsive popup layout
- Custom colors via `theme`

## Quick Start

```javascript
const datePicker = $('#datepicker').modernDatePicker({
  format: 'YYYY-MM-DD',
  popupDateFormat: 'YYYY-MM-DD',
  timezone: 'UTC'
});
```

## Full Configuration Example

```javascript
const datePicker = $('#datepicker').modernDatePicker({
  startDate: null,
  endDate: null,
  minDate: null,
  maxDate: null,
  theme: {
    defaultColor: '#007aff',
    subtleColor: '#e6f0ff'
  },
  format: 'YYYY-MM-DD',
  popupDateFormat: 'YYYY-MM-DD',
  showClear: true,
  showClose: true,
  showApply: true,
  closeOnEscape: false,
  closeOnOutsideClick: true,
  singleDate: false,
  onChange: null,
  onSelect: null,
  onClose: null,
  onOpen: null,
  onInit: null,
  autoApply: false,
  startLabel: 'Start Date',
  endLabel: 'End Date',
  timezone: 'UTC',
  monthsToShow: null,
  monthView: 'start',
  presets: []
});
```

## Presets Example

`presets` is fully data-driven. No hardcoded preset names are required.

```javascript
const datePicker = $('#datepicker').modernDatePicker({
  timezone: 'UTC',
  autoApply: true,
  presets: [
    // String dates
    { title: 'Yesterday', startDate: '2026-03-05', endDate: '2026-03-05' },

    // Native Date objects
    { title: 'Last 7 Days', startDate: new Date('2026-02-28'), endDate: new Date('2026-03-06') },

    // Dayjs objects (if available in your app)
    { title: 'Last 14 Days', startDate: dayjs().subtract(13, 'day'), endDate: dayjs() },

    // Start-only preset (range mode moves active segment to end date)
    { title: 'From Yesterday', startDate: dayjs().subtract(1, 'day') }
  ]
});
```

Preset behavior:
- Each item requires `title` and `startDate`
- `endDate` is optional
- `startDate` and `endDate` accept `String`, `Date`, or `Dayjs`
- Values are normalized internally to Dayjs in the configured timezone
- In range mode, if only `startDate` is provided, selector focus moves to end date
- If both dates are present and `autoApply` is `true`, value is applied and popup closes

## Month Anchoring Example (`monthView`)

```javascript
$('#datepicker').modernDatePicker({
  minDate: '2026-01-01',
  maxDate: '2026-12-31',
  monthView: 'end', // open from end side
  monthsToShow: () => 3
});
```

- `monthView: 'start'`: first-open anchor priority is `startDate`, then `minDate`, then current month
- `monthView: 'end'`: first-open anchor priority is `endDate`, then `maxDate`, then current month

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `startDate` | Date\|String\|Dayjs | `null` | Initial start date |
| `endDate` | Date\|String\|Dayjs | `null` | Initial end date |
| `minDate` | Date\|String\|Number | `null` | Minimum selectable date. Number means days offset from today |
| `maxDate` | Date\|String\|Number | `null` | Maximum selectable date. Number means days offset (from `minDate` if present, else today) |
| `theme` | Object | `{}` | Optional colors: `defaultColor`, `subtleColor` |
| `format` | String | `'YYYY-MM-DD'` | Input value format |
| `popupDateFormat` | String | `'YYYY-MM-DD'` | Date display format in popup selectors |
| `showClear` | Boolean | `true` | Show clear button |
| `showClose` | Boolean | `true` | Show close button |
| `showApply` | Boolean | `true` | Show apply button (manual mode) |
| `closeOnEscape` | Boolean | `false` | Close popup on Escape key |
| `closeOnOutsideClick` | Boolean | `true` | Close popup on outside click |
| `singleDate` | Boolean | `false` | Enable single-date mode |
| `autoApply` | Boolean | `false` | Apply and close automatically when selection is complete |
| `startLabel` | String | `'Start Date'` | Label text for start selector |
| `endLabel` | String | `'End Date'` | Label text for end selector |
| `timezone` | String | `'UTC'` | Timezone for parsing and normalization |
| `monthsToShow` | Function\|`null` | `null` | Callback for months to render (fallback is responsive: 1/2/3) |
| `monthView` | String | `'start'` | Initial month anchor side: `'start'` or `'end'` |
| `presets` | Array<Object> | `[]` | Preset pills shown above selectors |
| `onChange` | Function\|`null` | `null` | Called when applied value changes: `(startDate, endDate)` |
| `onSelect` | Function\|`null` | `null` | Called on selection updates: `(startDate, endDate)` |
| `onOpen` | Function\|`null` | `null` | Called when popup opens |
| `onClose` | Function\|`null` | `null` | Called when popup closes |
| `onInit` | Function\|`null` | `null` | Called after initialization |

## Events

| Event | Parameters | When it fires |
|-------|------------|---------------|
| `onInit` | `(options)` | Once after initialization |
| `onSelect` | `(startDate, endDate)` | When user selects a day or preset |
| `onChange` | `(startDate, endDate)` | When value is applied |
| `onOpen` | `()` | When popup opens |
| `onClose` | `()` | When popup closes |

## Methods

```javascript
// Open picker
datePicker.open();

// Close picker
datePicker.close();

// Clear current selection
datePicker.clear();

// Switch mode: 'single' or range mode (any non-'single' value)
datePicker.switchDateType('single');
datePicker.switchDateType('range');

// Set active selector in range mode
datePicker.switchActiveDateSelector('start');
datePicker.switchActiveDateSelector('end');
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Opera (latest)

## License

MIT License