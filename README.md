# Modern Date Picker

A modern, responsive date range picker with a beautiful UI and smooth animations. Built with vanilla JavaScript.

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

## Features

- 🎨 Beautiful, modern UI with smooth animations
- 📱 Fully responsive design
- 🎯 Single date or date range selection
- ⚡ Smooth sliding animations for month navigation
- 🕒 Timezone support
- 📅 Min/max date constraints
- 🎯 Clear date selection
- 🔄 Auto-apply or manual apply options
- ⌨️ Keyboard navigation support
- 📱 Touch-friendly interface
- 🎯 Custom date formats
- 🔍 Date validation

## Usage

```javascript
const datePicker = $('#datepicker').modernDatePicker({
    startDate: null,
    endDate: null,
    minDate: null,
    maxDate: null,
    theme:{
        defaultColor: '#007aff',
        subtleColor: '#e6f0ff'
    },
    format: 'YYYY-MM-DD',
    popupDateFormat: "YYYY-MM-DD",
    showClear: true,
    showClose: true,
    showApply: true,
    closeOnEscape: false,
    singleDate: false,
    onChange: null,
    onSelect: null,
    onClose: null,
    onOpen: null,
    onInit: null,
    autoApply: false,
    startLabel: 'Start Date',
    endLabel: 'End Date',
    timezone: "UTC",
    monthsToShow: null
});
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| startDate | Date | null | Initial start date |
| endDate | Date | null | Initial end date |
| minDate | Date | null | Minimum selectable date (number of days from today, 0 for today and negative to allow past) |
| maxDate | Date | null | Maximum selectable date (number of days from today, 0 for today and negative to allow past) |
| format | String | 'YYYY-MM-DD' | Input field date format |
| popupDateFormat | String | 'YYYY-MM-DD' | Date format in popup |
| showClear | Boolean | true | Show clear button |
| showClose | Boolean | true | Show close button |
| showApply | Boolean | true | Show apply button |
| singleDate | Boolean | false | Enable single date selection |
| autoApply | Boolean | true | Auto apply on date selection |
| startLabel | String | 'Start Date' | Label for start date |
| endLabel | String | 'End Date' | Label for end date |
| timezone | String | 'UTC' | Timezone for date handling |
| monthsToShow | Callback | null | Callback function to decide how many months to render |


## Events

| Event | Description | Parameters |
|-------|-------------|------------|
| onInit | Triggered when picker is initialized | (instance) |
| onChange | Triggered when dates change | (startDate, endDate) |
| onSelect | Triggered when a date is selected | (date) |
| onClose | Triggered when picker is closed | () |
| onOpen | Triggered when picker is opened | () |

## Methods

```javascript
// Open picker
datePicker.open();

// Close picker
datePicker.close();

// Clear dates
datePicker.clear();

// Switch between single date and range
datePicker.switchDateType('single'); // or 'range'

// Change default date segment on calendar open
datePicker.switchActiveDateSelector('start'); // or 'end'

```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Opera (latest)

## License

MIT License 