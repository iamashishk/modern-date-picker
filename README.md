# Flight Date Picker

A modern, responsive date range picker with a beautiful UI and smooth animations. Built with jQuery and vanilla JavaScript.

## Features

- 🎨 Beautiful, modern UI with smooth animations
- 📱 Fully responsive design
- 🌓 Dark mode support
- 🎯 Single date or date range selection
- ⚡ Smooth sliding animations for month navigation
- 🕒 Timezone support
- 📅 Min/max date constraints
- 🎯 Clear date selection
- 🔄 Auto-apply or manual apply options
- 🎨 Customizable styling
- 🌐 Localization support

## Installation

```bash
npm install flight-date-picker
```

## Usage

```javascript
$('#datepicker').flightDatePicker({
    startDate: new Date(),
    endDate: null,
    minDate: null,
    maxDate: null,
    format: 'YYYY-MM-DD',
    popupDateFormat: "YYYY-MM-DD",
    locale: 'en',
    showClear: true,
    showClose: true,
    showApply: true,
    singleDate: false,
    onChange: null,
    onSelect: null,
    onClose: null,
    onOpen: null,
    onInit: null,
    autoApply: true,
    startLabel: 'Start Date',
    endLabel: 'End Date',
    timezone: "UTC"
});
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| startDate | Date | null | Initial start date |
| endDate | Date | null | Initial end date |
| minDate | Date | null | Minimum selectable date |
| maxDate | Date | null | Maximum selectable date |
| format | String | 'YYYY-MM-DD' | Input field date format |
| popupDateFormat | String | 'YYYY-MM-DD' | Date format in popup |
| locale | String | 'en' | Locale for date formatting |
| showClear | Boolean | true | Show clear button |
| showClose | Boolean | true | Show close button |
| showApply | Boolean | true | Show apply button |
| singleDate | Boolean | false | Enable single date selection |
| autoApply | Boolean | true | Auto apply on date selection |
| startLabel | String | 'Start Date' | Label for start date |
| endLabel | String | 'End Date' | Label for end date |
| timezone | String | 'UTC' | Timezone for date handling |

## Events

| Event | Description |
|-------|-------------|
| onChange | Triggered when dates change |
| onSelect | Triggered when a date is selected |
| onClose | Triggered when picker is closed |
| onOpen | Triggered when picker is opened |
| onInit | Triggered when picker is initialized |

## Methods

```javascript
// Open picker
$('#datepicker').flightDatePicker('open');

// Close picker
$('#datepicker').flightDatePicker('close');

// Clear dates
$('#datepicker').flightDatePicker('clear');

// Get selected dates
$('#datepicker').flightDatePicker('getDates');

// Switch between single date and range
$('#datepicker').flightDatePicker('switchDateType', 'single'); // or 'range'
```

## Styling

The picker comes with a default light theme and supports dark mode. You can customize the appearance by overriding the CSS variables or modifying the CSS classes.

### Dark Mode

```javascript
$('#datepicker').flightDatePicker({
    // ... other options
    theme: 'dark'
});
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Dependencies

- jQuery 3.0+

## License

MIT License 