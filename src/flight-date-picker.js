import './flight-date-picker.css';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

(function($) {
    'use strict'; 

    const FlightDatePicker = function(element, options) {
        this.element = element;
        this.$element = $(element);
        this.options = $.extend({}, FlightDatePicker.defaults, options);
        if(options.startDate){
            options.startDate = dayjs(options.startDate).startOf('day');
        }
        if(options.endDate){
            options.endDate = dayjs(options.endDate).endOf('day');
        }
        if(options.minDate!==null){
            options.minDate = dayjs().utc().add(options.minDate,'days').startOf('day');
            options['minDateMonth'] = options.minDate.clone().startOf('month');
        }
        if(options.maxDate){
            options.maxDate = dayjs().utc().add(options.maxDate,'days').endOf('day');
            options['maxDateMonth'] = options.maxDate.clone().startOf('month');
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
        autoApply: false,
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
            this.boundEscKeyClose = null;
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
            if (typeof this.options.onInit === 'function') {
                this.options.onInit.call(this, this.options);
            }
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
                const date = dayjs.utc(dateStr);
                self.selectDate(date);
            });
            this.$calendar.find(".flight-date-picker-header").on('click', '.flight-date-picker-apply', function(e) {
                self.apply(true);
            });
            this.$calendar.find(".flight-date-picker-header").on('click', '.flight-date-picker-clear', function() {
                self.clear();
            });
            this.$calendar.find(".flight-date-picker-header").on('click', '.flight-date-picker-cancel', function() {
                self.close();
            });
            this.$calendar.find(".flight-date-picker-body").on('click', '.flight-date-picker-prev', function() {
                if ($(this).hasClass('disabled')) return;
                self.moveMonth(-1);
            });
            this.$calendar.find(".flight-date-picker-body").on('click', '.flight-date-picker-next', function() {
                if ($(this).hasClass('disabled')) return;
                self.moveMonth(1);
            });
            this.$calendar.find(".flight-date-picker-selectors").on('click', '.segment-clear', function(e) {
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
                self.apply();
            });
            this.$calendar.find(".flight-date-picker-selectors").on('click', '.segment', function() {
                if ($(this).hasClass('start-segment')) {
                    self.activeSelector = 'start';
                } else if ($(this).hasClass('end-segment')) {
                    self.activeSelector = 'end';
                }
                self._renderSelectorClasses();
            });
            this.boundDocumentClick = function(e) {
                if (self.popupOpen) {
                    const $container = self.$calendar.parent(), target = $(e.target), targetClassList = e.target.classList;
                    let targetClass="";
                    $.each(targetClassList,function(index,value){if(typeof value==="string" && value.length>0) targetClass += "."+value;});
                    if($container.find(target).length===0&&$container.find(targetClass).length===0&&!self.$element.is(target)){
                        self.close();
                    }
                }
            };
            $(document).on('click', this.boundDocumentClick);
            this.boundEscKeyClose = function(e) {
                if (self.popupOpen) {
                    if (e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27) {
                        self.close();
                    }
                }
            };
            $(document).on('keyup', this.boundEscKeyClose);
            this.boundResize = function() { self.render(); };
            $(window).on('resize', this.boundResize);

        },

        unbindEvents: function() {
            if (this.$calendar) this.$calendar.off();
            if (this.boundDocumentClick) $(document).off('click', this.boundDocumentClick);
            if (this.boundEscKeyClose) $(document).off('keyup', this.boundEscKeyClose);
            if (this.boundResize) $(window).off('resize', this.boundResize);
            this.boundDocumentClick = null;
            this.boundResize = null;
            this.boundEscKeyClose = null;
        },

        moveMonth: function(delta) {
            if(!this.currentMonth) return;
            const newMonth = this.currentMonth.clone().add(delta,'month');
            if (this.options.minDate && this.options.minDate.diff(newMonth,'month')>0){
                return;
            }
            if (this.options.maxDate && this.options.maxDate.diff(newMonth,'month') < this.getMonthsToShow()-1){
                return;
            }
            this.currentMonth = newMonth;
            this.renderMonthsOnly();
        },

        render: function() {
            if (!this.$calendar) return;
            this.renderHeader();
            this.renderSelectors();
            this._renderSelectorClasses();
            this.renderMonthsOnly();
            this.apply(false);
        },

        renderHeader: function() {
            let leftButtons = `<button class="flight-date-picker-cancel">Cancel</button>`;
            let rightButtons = '';
            if (!this.options.autoApply) {
                leftButtons += `<button class="flight-date-picker-clear" type="button">Clear</button>`;
                rightButtons += `<button class="flight-date-picker-apply" type="button">Set</button>`;
            }else{
                rightButtons += `<button class="flight-date-picker-clear" type="button">Clear</button>`;
            }
            this.$header.html(`
                <div class="flight-date-picker-header-left">${leftButtons}</div>
                <span class="flight-date-picker-title"></span>
                <div class="flight-date-picker-header-right">${rightButtons}</div>
            `);
            if (!this.options.autoApply) {
                if (!this.options.singleDate && (!this.options.startDate || !this.options.endDate)) {
                    this.$header.find('.flight-date-picker-apply').prop('disabled', true);
                } else if (this.options.singleDate && !this.options.startDate) {
                    this.$header.find('.flight-date-picker-apply').prop('disabled', true);
                } else {
                    this.$header.find('.flight-date-picker-apply').prop('disabled', false);
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
                outbound = `<span class="segment-date">${this.options.startDate.format(this.options.popupDateFormat)}</span>`;
                outboundClear = '<span class="segment-clear" data-type="start">&#10005;</span>';
            }
            if (this.options.endDate) {
                ret = `<span class="segment-date">${this.options.endDate.format(this.options.popupDateFormat)}</span>`;
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
                    <div class="segment-slider"></div>
                </div>
            `);
        },

        _renderSelectorClasses: function(){
            if (!this.activeSelector || this.activeSelector==="start") {
                this.$calendar.find(".segment.start-segment").addClass("active");
                this.$calendar.find(".segment.end-segment").removeClass("active");
                this.activeSelector='start';
            } else if (this.activeSelector==="end") {
                this.activeSelector = 'end';
                this.$calendar.find(".segment.start-segment").removeClass("active");
                this.$calendar.find(".segment.end-segment").addClass("active");
            }
        },

        renderMonthsOnly: function(slideDirection = null) {
            if (!this.$body) return;
            const monthsToShow = this.getMonthsToShow();
            let monthArrayLength = monthsToShow,leftMonthPad=0,rightMonthPad=0;

            let monthArrayStart = this.currentMonth;
            if(!monthArrayStart){
                if(this.options.startDate){
                    monthArrayStart = dayjs.utc(this.options.startDate).startOf('month');
                }else if(this.options.minDateMonth){
                    monthArrayStart = dayjs.utc(this.options.minDateMonth).startOf('month');
                }else{
                    monthArrayStart = dayjs.utc().startOf('month');
                }
            }

            if(this.options.minDateMonth){
                if(monthArrayStart.subtract(1,'month').diff(this.options.minDateMonth,'month') >= 0){
                    monthArrayStart = monthArrayStart.subtract(1,'month');
                    monthArrayLength++;
                    leftMonthPad++;
                }
            }else{
                monthArrayLength++;
                leftMonthPad++;
            }

            if(this.options.maxDateMonth){
                if(monthArrayStart.add(monthsToShow+1,'month').diff(this.options.maxDateMonth,'month') <= 0){
                    monthArrayLength++;
                    rightMonthPad++;
                }else if(this.options.maxDateMonth.diff(monthArrayStart,'month')+1 <= monthArrayLength){
                    monthArrayLength = this.options.maxDateMonth.diff(monthArrayStart,'month')+1;
                    rightMonthPad = 0;
                }else{
                    monthArrayLength++;
                    rightMonthPad++;
                }
            }else{
                monthArrayLength++;
                rightMonthPad++;
            }

            const months = [];
            
            for(let monthIndex = 0; monthIndex < monthArrayLength; monthIndex++){
                months.push(monthArrayStart.add(monthIndex,'month'));
            }

            let visibleStart = leftMonthPad;
            let visibleEnd = monthArrayLength - rightMonthPad;

            const prevDisabled = leftMonthPad === 0;
            const nextDisabled = rightMonthPad === 0;
            
            let html = `
                <div class="flight-date-picker-prev${prevDisabled ? ' disabled' : ''}" aria-disabled="${prevDisabled}">&#8592;</div>
                <div class="flight-date-picker-months${slideDirection ? ' sliding ' + slideDirection : ''}">`;
            
            for (let i = 0; i < months.length; i++) {
                const month = months[i];
                const daysInMonth = month.daysInMonth();
                const firstDay = month.startOf('month').day();
                
                const isVisible = i >= visibleStart && i < visibleEnd;

                if(isVisible && !this.currentMonth){
                    this.currentMonth=month;
                }
                html += `<div class="flight-date-picker-month-block ${isVisible ? 'visible' : 'buffer'}">
                    <div class="flight-date-picker-month-label">
                        <span>${month.format('MMM')} ${month.format('YYYY')}</span>
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
                    const date = month.clone().date(d);
                    const isInRange = this.isInRange(date);
                    const isDisabled = this.isDisabled(date);
                    const dateType = this.selectedDateType(date);
                    const isSelected = this.isSelected(date);
                    html += `
                        <div class="flight-date-picker-day ${typeof dateType==="string"?dateType+'-date ':''}  ${isSelected ? 'selected ' : ''} ${isInRange ? 'in-range ' : ''} ${isDisabled ? 'disabled ' : ''}" data-date="${date.format('YYYY-MM-DD\THH:mm:ss')}">${d}</div>
                    `;
                }
                html += '</div></div>';
            }
            html += `</div>
                <div class="flight-date-picker-next${nextDisabled ? ' disabled' : ''}" aria-disabled="${nextDisabled}">&#8594;</div>`;
            
            this.$body.html(html);
            
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
                const format = this.options.startDate.format(this.options.format);
                if (this.options.endDate) {
                    this.$element.val(`${format} - ${this.options.endDate.format(this.options.format)}`);
                } else {
                    this.$element.val(format);
                }
            }
            
            if (typeof this.options.onChange === 'function') {
                this.options.onChange.call(this, this.options.startDate, this.options.endDate);
            }
            if(autoClose){
                if ((this.options.singleDate && this.options.startDate) || 
                    (!this.options.singleDate && this.options.startDate && this.options.endDate)) {
                    this.close();
                }
            }
        },

        isSelected: function(date) {
            if (!this.options.startDate || !(date instanceof Object) || isNaN(date)) return false;
            return (this.options.startDate && date.format('YYYY-MM-DD') === this.options.startDate.format('YYYY-MM-DD')) || (this.options.endDate && date.format('YYYY-MM-DD') === this.options.endDate.format('YYYY-MM-DD'));
        },

        selectedDateType: function(date) {
            if (!this.options.startDate || !(date instanceof Object) || isNaN(date)) return false;
            if (this.options.singleDate) {
                return 'single';
            }
            if (this.options.startDate && date.format('YYYY-MM-DD') === this.options.startDate.format('YYYY-MM-DD')) return 'start';
            if (this.options.endDate && date.format('YYYY-MM-DD') === this.options.endDate.format('YYYY-MM-DD')) return 'end';
        },

        isDisabled: function(date) {
            if (!(date instanceof Object) || isNaN(date)) return true;
            if (!this.options.singleDate && this.options.startDate && date.isBefore(this.options.startDate)) return true;
            if (this.options.minDate && date.isBefore(this.options.minDate)) return true;
            if (this.options.maxDate && date.isAfter(this.options.maxDate)) return true;
        },

        isInRange: function(date) {
            if (!this.options.startDate || !this.options.endDate) return false;
            else{
                return date.startOf('day').diff(this.options.startDate.startOf('day'),'day') > 0 && date.startOf('day').diff(this.options.endDate.endOf('day'),'day') < 0;
            }
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
    };
    $.fn.flightDatePicker = function(options) {
        return this.each(function() {
            if (!$(this).data('flightDatePicker')) {
                $(this).data('flightDatePicker', new FlightDatePicker(this, options));
            }
        });
    };

})(jQuery); 