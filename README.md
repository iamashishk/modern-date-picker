# Flight Date Picker

A modern, customizable jQuery date range picker inspired by flight booking interfaces.

## Features

- Date range selection
- Single date selection
- Min/max date constraints
- Disabled dates support
- Dark theme support
- Responsive design
- Customizable styling
- Event callbacks
- jQuery plugin

## Installation

```bash
npm install flight-date-picker
```

Or include the files directly in your HTML:

```html
<link rel="stylesheet" href="path/to/flight-date-picker.css">
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="path/to/flight-date-picker.js"></script>
```

## Usage

Basic usage:

```javascript
$('#datepicker').flightDatePicker();
```

With options:

```javascript
$('#datepicker').flightDatePicker({
    startDate: null,
    endDate: null,
    minDate: null,
    maxDate: null,
    disabledDates: [],
    format: 'YYYY-MM-DD',
    locale: 'en',
    theme: 'light',
    showWeekNumbers: true,
    showToday: true,
    showClear: true,
    showClose: true,
    showApply: true,
    singleDate: false,
    autoClose: true,
    inline: false,
    position: 'auto',
    onChange: function(startDate, endDate) {
        console.log('Selected dates:', startDate, endDate);
    },
    onSelect: function(startDate, endDate) {
        console.log('Dates selected:', startDate, endDate);
    },
    onClose: function() {
        console.log('Date picker closed');
    },
    onOpen: function() {
        console.log('Date picker opened');
    }
});
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| startDate | Date | null | Initial start date |
| endDate | Date | null | Initial end date |
| minDate | Date | null | Minimum selectable date |
| maxDate | Date | null | Maximum selectable date |
| disabledDates | Array | [] | Array of dates that cannot be selected |
| format | String | 'YYYY-MM-DD' | Date format string |
| locale | String | 'en' | Locale for date formatting |
| theme | String | 'light' | Theme ('light' or 'dark') |
| showWeekNumbers | Boolean | true | Show week numbers |
| showToday | Boolean | true | Show today's date |
| showClear | Boolean | true | Show clear button |
| showClose | Boolean | true | Show close button |
| showApply | Boolean | true | Show apply button |
| singleDate | Boolean | false | Enable single date selection |
| autoClose | Boolean | true | Close picker after selection |
| inline | Boolean | false | Show picker inline |
| position | String | 'auto' | Position of the picker |
| onChange | Function | null | Callback when dates change |
| onSelect | Function | null | Callback when dates are selected |
| onClose | Function | null | Callback when picker closes |
| onOpen | Function | null | Callback when picker opens |

## Methods

```javascript
// Get the date picker instance
const picker = $('#datepicker').data('flightDatePicker');

// Open the picker
picker.open();

// Close the picker
picker.close();

// Clear selected dates
picker.clear();

// Get selected dates
const { startDate, endDate } = picker.options;
```

## Events

The date picker triggers the following events:

- `change.flightDatePicker`: When dates change
- `select.flightDatePicker`: When dates are selected
- `close.flightDatePicker`: When picker closes
- `open.flightDatePicker`: When picker opens

Example:

```javascript
$('#datepicker').on('change.flightDatePicker', function(e, startDate, endDate) {
    console.log('Dates changed:', startDate, endDate);
});
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- IE 11 (with polyfills)

## License

MIT 