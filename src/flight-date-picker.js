import { type } from 'jquery';
import './flight-date-picker.css';

(function($) {
    'use strict'; 

    const FlightDatePicker = function(element, options) {
        this.element = element;
        this.$element = $(element);
        this.options = $.extend({}, FlightDatePicker.defaults, options);
        if(options.startDate){
            options.startDate = new Date(this._getFormattedDate(options.startDate,"YYYY-MM-DD\THH:mm:ss"));
        }
        if(options.endDate){
            options.endDate = new Date(this._getFormattedDate(options.endDate,"YYYY-MM-DD\THH:mm:ss"));
        }
        if(options.minDate){
            options.minDate = new Date(this._getFormattedDate(options.minDate,"YYYY-MM-DD\THH:mm:ss"));
        }
        if(options.maxDate){
            options.maxDate = new Date(this._getFormattedDate(options.maxDate,"YYYY-MM-DD\THH:mm:ss"));
        }
        this.options = $.extend({}, FlightDatePicker.defaults, options);
        this.init();
    };

    FlightDatePicker.defaults = {
        startDate: null,
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
        timezone: "UTC",
    };

    FlightDatePicker.prototype = {
        init: function() {
            this.currentMonth = null;
            this.animating = false;
            this.activeSelector = null;
            this.popupOpen = false;
            this.boundDocumentClick = null;
            this.boundResize = null;
            if (this.options.startDate || this.options.endDate) {
                if (typeof this.options.onSelect === 'function') {
                    this.options.onSelect.call(this, this.options.startDate, this.options.endDate);
                }
                if (typeof this.options.onChange === 'function') {
                    this.options.onChange.call(this, this.options.startDate, this.options.endDate);
                }
            }
            this.apply(false);
            this.$element.off('.flightDatePicker').on('click.flightDatePicker', (e) => {
                e.preventDefault();
                this.toggle();
            });
        },
        buildCalendar: function() {
            this.$calendar = $('<div class="flight-date-picker"></div>');
            this.$header = $('<div class="flight-date-picker-header"></div>');
            this.$selectors = $('<div class="flight-date-picker-selectors"></div>');
            this.$body = $('<div class="flight-date-picker-body"></div>');
            this.$calendar.append(this.$header, this.$selectors, this.$body);
            this.$container = $('<div class="flight-date-picker-container"></div>');
            this.$container.append(this.$calendar);
            $('body').append(this.$container);
        },

        destroyCalendar: function() {
            if (this.$calendar) {
                this.$calendar.parent().remove();
                this.$calendar = null;
                this.$header = null;
                this.$selectors = null;
                this.$body = null;
                this.$footer = null;
            }
        },

        bindEvents: function() {
            const self = this;
            if (!this.$calendar) return;
            this.$calendar.on('click', '.flight-date-picker-day', function() {
                if($(this).hasClass('disabled')) return;
                const dateStr = $(this).data('date');
                if (!dateStr) return;
                const date = new Date(dateStr);
                self.selectDate(date);
            });
            this.$calendar.on('click', '.flight-date-picker-clear', function() {
                self.clear();
            });
            this.$calendar.on('click', '.flight-date-picker-cancel', function() {
                self.close();
            });
            this.$calendar.on('click', '.flight-date-picker-prev', function() {
                if ($(this).hasClass('disabled')) return;
                self.moveMonth(-1);
            });
            this.$calendar.on('click', '.flight-date-picker-next', function() {
                if ($(this).hasClass('disabled')) return;
                self.moveMonth(1);
            });
            this.$calendar.on('click', '.segment-clear', function(e) {
                e.stopPropagation();
                const type = $(this).data('type');
                if (type === 'start') {
                    self.options.startDate = null;
                    self.options.endDate = null;
                } else if (type === 'end') {
                    self.options.endDate = null;
                }
                self.activeSelector = type;
                self.render();
            });
            this.$calendar.on('click', '.segment', function() {
                if ($(this).hasClass('start-segment')) {
                    self.activeSelector = 'start';
                } else if ($(this).hasClass('end-segment')) {
                    self.activeSelector = 'end';
                }
                self.render();
            });
            // Document click to close
            this.boundDocumentClick = function(e) {
                if (self.popupOpen) {
                    // const $container = self.$calendar;
                    // console.log(self.$container,self.$container.find(e.target),self.$container.find(e.target).length);
                    // if (!$(e.target).closest('.flight-date-picker').length && !self.$element.is(e.target)) {
                    //     self.close();
                    // }
                    // if (
                    //     $container &&
                    //     !$container.is(e.target) &&
                    //     $container.find(e.target).length === 0 &&
                    //     !self.$element.is(e.target)
                    // ) {
                    //     // self.close();
                    // }
                }
            };
            $(document).on('click', this.boundDocumentClick);
            // Window resize
            this.boundResize = function() { self.render(); };
            $(window).on('resize', this.boundResize);
        },

        unbindEvents: function() {
            if (this.$calendar) this.$calendar.off();
            if (this.boundDocumentClick) $(document).off('click', this.boundDocumentClick);
            if (this.boundResize) $(window).off('resize', this.boundResize);
            this.boundDocumentClick = null;
            this.boundResize = null;
            // Do NOT unbind input click here
        },

        moveMonth: function(delta) {
            if (!this.currentMonth) {
                this.currentMonth = this.options.startDate ? new Date(this.options.startDate) : new Date();
                this.currentMonth.setDate(1);
            }
            // Calculate the new month
            const newMonth = new Date(this.currentMonth);
            newMonth.setMonth(newMonth.getMonth() + delta);
            // Check minDate/maxDate
            if (this.options.minDate) {
                const minMonth = new Date(this.options.minDate.getFullYear(), this.options.minDate.getMonth(), 1);
                if (newMonth < minMonth) return;
            }
            if (this.options.maxDate) {
                const maxMonth = new Date(this.options.maxDate.getFullYear(), this.options.maxDate.getMonth(), 1);
                console.log(newMonth,maxMonth,newMonth > maxMonth)
                if (newMonth > maxMonth) return;
            }

            // Animate slide
            const slideDirection = delta > 0 ? 'left' : 'right';
            const monthsContainer = this.$body.find('.flight-date-picker-months');
            
            // Add sliding class to trigger animation
            monthsContainer.addClass('sliding ' + slideDirection);
            
            // Update current month and re-render after animation
            setTimeout(() => {
                this.currentMonth = newMonth;
                this.renderMonthsOnly();
                monthsContainer.removeClass('sliding left right');
            }, 300);
        },

        render: function() {
            if (!this.$calendar) return;
            this.renderHeader();
            this.renderSelectors();
            this.renderMonthsOnly();
            this.apply(false);
        },

        renderHeader: function() {
            let buttons = `<button class="flight-date-picker-cancel">Cancel</button>`;
            let setBtn = '';
            if (!this.options.autoApply) {
                buttons += `<button class="flight-date-picker-clear">Clear</button>`;
                setBtn = `<button class="flight-date-picker-set">Set</button>`;
            }else{
                setBtn = `<button class="flight-date-picker-clear">Clear</button>`;
            }
            this.$header.html(`
                <div class="flight-date-picker-header-left">${buttons}</div>
                <span class="flight-date-picker-title"></span>
                ${setBtn}
            `);
            const self = this;
            this.$header.find('.flight-date-picker-set').off('click').on('click', function() {
                self.apply();
            });
            // Disable Set if not ready
            if (!this.options.autoApply) {
                if (!this.options.singleDate && (!this.options.startDate || !this.options.endDate)) {
                    this.$header.find('.flight-date-picker-set').prop('disabled', true);
                } else if (this.options.singleDate && !this.options.startDate) {
                    this.$header.find('.flight-date-picker-set').prop('disabled', true);
                } else {
                    this.$header.find('.flight-date-picker-set').prop('disabled', false);
                }
            }
        },

        renderSelectors: function() {
            if(this.options.singleDate){
                this.$selectors.html('');
                return;
            }
            let outbound = '<span class="segment-placeholder">-</span>';
            let ret = '<span class="segment-placeholder">-</span>';
            let outboundClear = '';
            let returnClear = '';
            if (this.options.startDate) {
                outbound = `<span class="segment-date">${this.formatDate(this.options.startDate)}</span>`;
                outboundClear = '<span class="segment-clear" data-type="start">&#10005;</span>';
            }
            if (this.options.endDate) {
                ret = `<span class="segment-date">${this.formatDate(this.options.endDate)}</span>`;
                returnClear = '<span class="segment-clear" data-type="end">&#10005;</span>';
            }
            const activeStart = (this.activeSelector === 'start' || (!this.activeSelector && (!this.options.startDate || (this.options.startDate && this.options.endDate)))) ? 'active' : '';
            const activeEnd = (this.activeSelector === 'end' || (this.options.startDate && !this.options.endDate && !this.activeSelector)) ? 'active' : '';
            this.$selectors.html(`
                <div class="flight-date-picker-segments flush">
                    <div class="segment start-segment ${activeStart}">
                        <div class="segment-container">
                            <div class="segment-label">${this.options.startLabel}</div>
                            <div class="segment-value">${outbound}</div>
                        </div>${outboundClear}
                    </div>
                    <div class="segment end-segment ${activeEnd}">
                        <div class="segment-container">
                            <div class="segment-label">${this.options.endLabel}</div>
                            <div class="segment-value">${ret}</div>
                        </div>${returnClear}
                    </div>
                </div>
            `);
        },

        renderMonthsOnly: function(slideDirection = null) {
            if (!this.$body) return;
            const monthsToShow = this.getMonthsToShow();
            
            // Initialize currentMonth if not set
            if (!this.currentMonth) {
                if (this.options.startDate) {
                    this.currentMonth = new Date(this.options.startDate);
                } else if (this.options.minDate && new Date() < this.options.minDate) {
                    this.currentMonth = new Date(this.options.minDate);
                } else {
                    this.currentMonth = new Date();
                }
                this.currentMonth.setDate(1);
            }

            let base = new Date(this.currentMonth);
            base.setDate(1);
            let startMonth = new Date(base);
            startMonth.setMonth(startMonth.getMonth() - 1);
            let endMonth = new Date(base);
            endMonth.setMonth(endMonth.getMonth() + monthsToShow);

            if (this.options.minDate) {
                const minMonth = new Date(this.options.minDate.getFullYear(), this.options.minDate.getMonth(), 1);
                if (startMonth < minMonth) startMonth = new Date(minMonth);
            }
            if (this.options.maxDate) {
                const maxMonth = new Date(this.options.maxDate.getFullYear(), this.options.maxDate.getMonth() + 1, 1);
                if (endMonth > maxMonth) {
                    // Ensure we have at least monthsToShow + 1 months before maxDate
                    endMonth = new Date(maxMonth);
                    startMonth = new Date(maxMonth);
                    startMonth.setMonth(startMonth.getMonth() - (monthsToShow + 1));
                    
                    // Adjust currentMonth if needed
                    if (this.currentMonth > maxMonth) { 
                        this.currentMonth = new Date(maxMonth);
                        this.currentMonth.setMonth(this.currentMonth.getMonth() - monthsToShow + 1);
                    }
                }
            }

            const months = [];
            let m = new Date(startMonth);

            while (m <= endMonth) {
                months.push(new Date(m));
                m.setMonth(m.getMonth() + 1);
            }

            console.log(monthsToShow,months)

            let visibleStart = 1;
            let visibleEnd = monthsToShow;
            if (months.length < monthsToShow + 2) {
                visibleStart = 0;
                visibleEnd = months.length - 2;
            }
            
            console.log(visibleStart,visibleEnd)

            const prevDisabled = typeof months[visibleStart-1] === 'undefined';
            const nextDisabled = typeof months[visibleEnd+1] !== 'undefined' && months[visibleEnd+1] > this.options.maxDate;

            // console.log(prevDisabled,nextDisabled)
            
            let html = `
                <div class="flight-date-picker-prev${prevDisabled ? ' disabled' : ''}" aria-disabled="${prevDisabled}">&#8592;</div>
                <div class="flight-date-picker-months${slideDirection ? ' sliding ' + slideDirection : ''}">`;
            
            for (let i = 0; i < months.length; i++) {
                const month = months[i];
                const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
                const firstDay = new Date(month.getFullYear(), month.getMonth(), 1).getDay();
                
                const isVisible = i >= visibleStart && i <= visibleEnd;
                html += `<div class="flight-date-picker-month-block ${isVisible ? 'visible' : 'buffer'}">
                    <div class="flight-date-picker-month-label">
                        <span>${month.toLocaleString('default', { month: 'long' })} ${month.getFullYear()}</span>
                    </div>
                    <div class="flight-date-picker-weekdays">`;
                
                const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
                weekdays.forEach(day => {
                    html += `<div class="flight-date-picker-weekday">${day}</div>`;
                });
                
                html += '</div><div class="flight-date-picker-days">';
                for (let d = 0; d < firstDay; d++) {
                    html += '<div class="flight-date-picker-day empty"></div>';
                }
                for (let d = 1; d <= daysInMonth; d++) {
                    const date = new Date(month.getFullYear(), month.getMonth(), d);
                    const isInRange = this.isInRange(date);
                    const isDisabled = this.isDisabled(date);
                    const dateType = this.selectedDateType(date);
                    const isSelected = this.isSelected(date);
                    html += `
                        <div class="flight-date-picker-day ${typeof dateType==="string"?dateType+'-date':''}  ${isSelected ? 'selected' : ''} ${isInRange ? 'in-range' : ''} ${isDisabled ? 'disabled' : ''}" data-date="${this._getFormattedDate(date,"YYYY-MM-DD\THH:mm:ss")}">${d}</div>
                    `;
                }
                html += '</div></div>';
            }
            html += `</div>
                <div class="flight-date-picker-next${nextDisabled ? ' disabled' : ''}" aria-disabled="${nextDisabled}">&#8594;</div>`;
            
            this.$body.html(html);
            
            // Animate if needed
            if (slideDirection) {
                const $months = this.$body.find('.flight-date-picker-months');
                setTimeout(() => {
                    $months.removeClass('sliding left right');
                }, 300);
            }
        },

        toggle: function() {
            if (this.popupOpen) {
                this.close();
            } else {
                this.open();
            }
        },

        open: function() {
            if (this.popupOpen) return;
            this.buildCalendar();
            this.popupOpen = true;
            this.$calendar.addClass('animating opening');
            this.$calendar.show();
            setTimeout(() => {
                this.$calendar.removeClass('opening');
            }, 10);
            setTimeout(() => {
                this.$calendar.removeClass('animating');
            }, 300);
            this.render();
            this.bindEvents();
            if (typeof this.options.onOpen === 'function') {
                this.options.onOpen.call(this);
            }
        },

        close: function() {
            if (!this.popupOpen) return;
            this.animating = true;
            this.$calendar.addClass('animating closing');
            setTimeout(() => {
                this.unbindEvents();
                this.$calendar?.hide();
                this.$calendar?.removeClass('closing animating');
                this.animating = false;
                this.popupOpen = false;
                this.destroyCalendar();
            }, 300);
            if (typeof this.options.onClose === 'function') {
                this.options.onClose.call(this);
            }
        },

        selectDate: function(date) {
            if (this.options.singleDate) {
                this.options.startDate = date;
                this.options.endDate = null;
                this.render();
                if (typeof this.options.onSelect === 'function') {
                    this.options.onSelect.call(this, this.options.startDate, null);
                }
                if (this.options.autoApply) {
                    this.apply();
                }
            } else {
                if (this.activeSelector === 'start' || (!this.activeSelector && (!this.options.startDate || (this.options.startDate && this.options.endDate)))) {
                    this.options.startDate = date;
                    this.options.endDate = null;
                    this.activeSelector = 'end';
                } else if (this.activeSelector === 'end' || (this.options.startDate && !this.options.endDate)) {
                    this.options.endDate = date;
                    if (this.options.endDate < this.options.startDate) {
                        const tmp = this.options.startDate;
                        this.options.startDate = this.options.endDate;
                        this.options.endDate = tmp;
                    }
                    this.activeSelector = null;
                }
                this.render();
                if (typeof this.options.onSelect === 'function') {
                    this.options.onSelect.call(this, this.options.startDate, this.options.endDate);
                }
                if (this.options.autoApply && this.options.startDate && this.options.endDate) {
                    this.apply();
                }
            }
        },

        clear: function() {
            this.options.startDate = null;
            this.options.endDate = null;
            this.render();
            this.$element.val('');
            
            if (typeof this.options.onChange === 'function') {
                this.options.onChange.call(this, null, null);
            }
        },

        apply: function(autoClose=true) {
            if (this.options.startDate) {
                const format = this.formatDate(this.options.startDate);
                if (this.options.endDate) {
                    this.$element.val(`${format} - ${this.formatDate(this.options.endDate)}`);
                } else {
                    this.$element.val(format);
                }
            }
            
            if (typeof this.options.onChange === 'function') {
                this.options.onChange.call(this, this.options.startDate, this.options.endDate);
            }
            if(autoClose){
                if ((this.options.singleDate && this.options.startDate && this.options.autoApply) || 
                    (!this.options.singleDate && this.options.startDate && this.options.endDate && this.options.autoApply)) {
                    this.close();
                }
            }
        },

        formatDate: function(date) {
            if (!(date instanceof Date) || isNaN(date)) return '';
            return date.toDateString();
        },

        isToday: function(date) {
            const today = new Date();
            return date.getDate() === today.getDate() &&
                   date.getMonth() === today.getMonth() &&
                   date.getFullYear() === today.getFullYear();
        },

        isSelected: function(date) {
            if (!this.options.startDate || !(date instanceof Date) || isNaN(date)) return false;
            
            // Normalize dates to start of day for comparison
            const normalizedDate = new Date(date);
            normalizedDate.setHours(0, 0, 0, 0);
            
            if (this.options.singleDate) {
                const normalizedStartDate = new Date(this.options.startDate);
                normalizedStartDate.setHours(0, 0, 0, 0);
                return normalizedDate.getTime() === normalizedStartDate.getTime();
            }

            if (this.options.startDate && (this.activeSelector === null || this.activeSelector === 'start')) {
                const normalizedStartDate = new Date(this.options.startDate);
                normalizedStartDate.setHours(0, 0, 0, 0);
                if (normalizedDate.getTime() === normalizedStartDate.getTime()) {
                    this.activeSelector = 'end';
                    return true;
                }
                return false;
            }

            if (this.options.endDate && this.activeSelector === 'end') {
                const normalizedEndDate = new Date(this.options.endDate);
                normalizedEndDate.setHours(0, 0, 0, 0);
                if (normalizedDate.getTime() === normalizedEndDate.getTime()) {
                    this.activeSelector = 'start';
                    return true;
                }
                return false;
            }

            return false;
        },

        selectedDateType: function(date) {
            if (!this.options.startDate || !(date instanceof Date) || isNaN(date)) return false;
            if (this.options.singleDate) {
                return 'single';
            }
            if (!this.options.endDate) {
                return date.getTime() === this.options.startDate.getTime() ? 'start' : false;
            }
            if (!(this.options.endDate instanceof Date) || isNaN(this.options.endDate)) return false;
            if (date.getTime() === this.options.startDate.getTime()) return 'start';
            if (date.getTime() === this.options.endDate.getTime()) return 'end';
        },

        isDisabled: function(date) {
            if (!(date instanceof Date) || isNaN(date)) return true;
            if (this.options.minDate && date < this.options.minDate) return true;
            if (this.options.maxDate && date > this.options.maxDate) return true;
        },

        isInRange: function(date) {
            if (!this.options.startDate || !this.options.endDate) return false;
            
            // Normalize dates to start of day for comparison
            const normalizedDate = new Date(date);
            normalizedDate.setHours(0, 0, 0, 0);
            
            const normalizedStartDate = new Date(this.options.startDate);
            normalizedStartDate.setHours(0, 0, 0, 0);
            
            const normalizedEndDate = new Date(this.options.endDate);
            normalizedEndDate.setHours(0, 0, 0, 0);
            
            return normalizedDate.getTime() > normalizedStartDate.getTime() && 
                   normalizedDate.getTime() < normalizedEndDate.getTime();
        },

        getMonthsToShow: function() {
            return window.innerWidth < 576 ? 1 : (window.innerWidth < 1260 ? 2 : 3);
        },
        switchDateType: function(type){
            if(type === 'single'){
                this.options.singleDate = true;
                this.options.endDate = null;
            }else{
                this.options.singleDate = false;
            }
            this.apply(false);
            if(this.popupOpen){
                this.render();
            }
        },
        _getFormattedDate: function(date,format="YYYY-MM-DD") {
            date = new Date(date);
            const parts = new Intl.DateTimeFormat('en-US', {
                timeZone: this.options.timezone,
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: format.includes('A') || format.includes('a')
            }).formatToParts(date).reduce((acc, part) => {
                acc[part.type] = part.value;
                return acc;
            }, {});
            const replacements = {
                'YYYY': parts.year,
                'MM': parts.month,
                'DD': parts.day,
                'HH': parts.hour.padStart(2, '0'),
                'hh': String((parseInt(parts.hour) % 12 || 12)).padStart(2, '0'),
                'mm': parts.minute,
                'ss': parts.second,
                'A': parts.dayPeriod?.toUpperCase() || '',
                'a': parts.dayPeriod?.toLowerCase() || ''
            };
            return format.replace(/YYYY|MM|DD|HH|hh|mm|ss|A|a/g, token => replacements[token]);
        },
        
        
    };
    $.fn.flightDatePicker = function(options) {
        return this.each(function() {
            if (!$(this).data('flightDatePicker')) {
                $(this).data('flightDatePicker', new FlightDatePicker(this, options));
            }
        });
    };

})(jQuery); 