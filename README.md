# Modern Date Picker

A modern, responsive date range picker with a beautiful UI and smooth animations. Built with vanilla JavaScript.

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
- 🌓 Dark mode support
- 🎯 Single date or date range selection
- ⚡ Smooth sliding animations for month navigation
- 🕒 Timezone support
- 📅 Min/max date constraints
- 🎯 Clear date selection
- 🔄 Auto-apply or manual apply options
- 🎨 Customizable styling
- 🌐 Localization support
- ⌨️ Keyboard navigation support
- 📱 Touch-friendly interface
- 🎯 Custom date formats
- 🔍 Date validation
- 🎨 Customizable themes
- 📦 Zero dependencies

## Usage

```javascript
const datePicker = new ModernDatePicker('#datepicker', {
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
    autoApply: true,
    startLabel: 'Start Date',
    endLabel: 'End Date',
    timezone: "UTC",
    theme: 'light'
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
| theme | String | 'light' | Theme mode ('light' or 'dark') |
| disabledDates | Array | [] | Array of dates to disable |
| enabledDates | Array | [] | Array of dates to enable (if set, only these dates will be selectable) |
| firstDayOfWeek | Number | 0 | First day of week (0 = Sunday, 1 = Monday, etc.) |
| showWeekNumbers | Boolean | false | Show week numbers |
| showTodayButton | Boolean | true | Show today button |
| showTimePicker | Boolean | false | Show time picker |
| timeFormat | String | 'HH:mm' | Time format when time picker is enabled |
| timeStep | Number | 30 | Time step in minutes |
| timeMin | String | '00:00' | Minimum time |
| timeMax | String | '23:59' | Maximum time |

## Events

| Event | Description | Parameters |
|-------|-------------|------------|
| onInit | Triggered when picker is initialized | (instance) |
| onChange | Triggered when dates change | (startDate, endDate) |
| onSelect | Triggered when a date is selected | (date) |
| onClose | Triggered when picker is closed | () |
| onOpen | Triggered when picker is opened | () |
| onClear | Triggered when dates are cleared | () |
| onApply | Triggered when dates are applied | (startDate, endDate) |
| onError | Triggered when an error occurs | (error) |

## Methods

```javascript
// Open picker
datePicker.open();

// Close picker
datePicker.close();

// Clear dates
datePicker.clear();

// Get selected dates
const dates = datePicker.getDates();

// Set dates
datePicker.setDates(startDate, endDate);

// Switch between single date and range
datePicker.switchDateType('single'); // or 'range'

// Update options
datePicker.updateOptions({
    theme: 'dark',
    // ... other options
});

// Destroy instance
datePicker.destroy();

// Get current state
const state = datePicker.getState();

// Set disabled dates
datePicker.setDisabledDates([new Date(), new Date()]);

// Set enabled dates
datePicker.setEnabledDates([new Date(), new Date()]);

// Set min date
datePicker.setMinDate(new Date());

// Set max date
datePicker.setMaxDate(new Date());

// Set timezone
datePicker.setTimezone('UTC');

// Set locale
datePicker.setLocale('en');
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Opera (latest)

## License

MIT License 