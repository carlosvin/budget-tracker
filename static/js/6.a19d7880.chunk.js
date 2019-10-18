(this["webpackJsonpbudget-tracker"]=this["webpackJsonpbudget-tracker"]||[]).push([[6],{111:function(e,t,n){"use strict";function r(e,t){return e/t}n.d(t,"a",(function(){return r}))},173:function(e,t,n){"use strict";n.r(t);var r=n(26),s=n(10),i=n(2),a=n.n(i),o=n(3),u=n(13),c=n(14),f=864e5;function h(e,t){return Math.floor((t-e)/f)+1}var l=function(){function e(){Object(u.a)(this,e),this._total=void 0,this._subTotals=void 0,this._total=0,this._subTotals={}}return Object(c.a)(e,[{key:"add",value:function(e,t){this._total+=e;var n=this._getSubTotal(t);return n&&n.add(e,t),this._total}},{key:"subtract",value:function(e,t){return this.add(-e,t)}},{key:"_getSubTotal",value:function(t){if(void 0!==t){var n=t.shift();if(void 0!==n)return n in this._subTotals||(this._subTotals[n]=new e),this._subTotals[n]}}},{key:"getSubtotal",value:function(e){var t=e.shift();return void 0!==t?t in this._subTotals?this._subTotals[t].getSubtotal(e):0:this.total}},{key:"getAverage",value:function(e){var t=e.shift();return void 0!==t?t in this._subTotals?this._subTotals[t].getAverage(e):0:this.avg}},{key:"total",get:function(){return this._total}},{key:"avg",get:function(){return this._total/Object.keys(this._subTotals).length}},{key:"indexes",get:function(){return Object.keys(this._subTotals)}}]),e}(),d=function(){function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:new Date;Object(u.a)(this,e),this._date=void 0,this._date=new Date(t.getFullYear(),t.getMonth(),t.getDate())}return Object(c.a)(e,[{key:"clone",value:function(){return new e(this._date)}},{key:"addDays",value:function(e){return this._date.setDate(this._date.getDate()+e),this}},{key:"addMonths",value:function(e){return this._date.setMonth(this._date.getMonth()+e),this}},{key:"addYears",value:function(e){return this._date.setFullYear(this._date.getFullYear()+e),this}},{key:"equals",value:function(e){return this._date.getTime()===e._date.getTime()}},{key:"year",get:function(){return this._date.getFullYear()}},{key:"month",get:function(){return this._date.getMonth()}},{key:"day",get:function(){return this._date.getDate()}},{key:"timeMs",get:function(){return this._date.getTime()}},{key:"isToday",get:function(){return e.isToday(this)}},{key:"shortString",get:function(){return new Intl.DateTimeFormat(void 0,{day:"numeric",month:"long",year:"numeric"}).format(this._date)}}],[{key:"fromTimeMs",value:function(t){return new e(new Date(t))}},{key:"fromYMD",value:function(t){return new e(new Date(t.year,t.month,t.day))}},{key:"isToday",value:function(e){var t=new Date;return e.day===t.getDate()&&e.month===t.getMonth()&&e.year===t.getFullYear()}}]),e}();function p(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function y(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?p(n,!0).forEach((function(t){Object(r.a)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):p(n).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var v=function(){function e(t){Object(u.a)(this,e),this._date=void 0,this.amount=void 0,this.amountBaseCurrency=void 0,this.currency=void 0,this.categoryId=void 0,this.countryCode=void 0,this.description=void 0,this.identifier=void 0,this.when=void 0,this.budgetId=void 0,this.splitInDays=void 0,this.identifier=t.identifier,this.amountBaseCurrency=t.amountBaseCurrency,this.amount=t.amount,this.currency=t.currency,this.categoryId=t.categoryId,this.countryCode=t.countryCode,this.description=t.description,this.when=t.when,this.budgetId=t.budgetId,this.splitInDays=t.splitInDays>0?t.splitInDays:1,this.validate()}return Object(c.a)(e,[{key:"inBudgetDates",value:function(e){return this.when<=e.to&&this.when>=e.from}},{key:"inDates",value:function(e,t){return this.when<=t&&this.when>=e}},{key:"addToTotals",value:function(e){var t=!0,n=!1,r=void 0;try{for(var s,i=this.split()[Symbol.iterator]();!(t=(s=i.next()).done);t=!0){var a=s.value;e.add(a.amountBaseCurrency,a.dateParts)}}catch(o){n=!0,r=o}finally{try{t||null==i.return||i.return()}finally{if(n)throw r}}}},{key:"subtractTotal",value:function(e){var t=!0,n=!1,r=void 0;try{for(var s,i=this.split()[Symbol.iterator]();!(t=(s=i.next()).done);t=!0){var a=s.value;e.subtract(a.amountBaseCurrency,a.dateParts)}}catch(o){n=!0,r=o}finally{try{t||null==i.return||i.return()}finally{if(n)throw r}}}},{key:"validate",value:function(){var e=[];if(void 0===this.budgetId&&e.push("budget identifier"),void 0===this.amountBaseCurrency&&e.push("amount in base currency"),2!==this.countryCode.length&&e.push("country code"),3!==this.currency.length&&e.push("currency code"),e.length>0)throw Error("Invalid expense (".concat(this.identifier,") fields: ").concat(e.join(", ")))}},{key:"split",value:function(){if(this.splitInDays<1)throw Error("You cannot split an expense in less than one piece");if(1===this.splitInDays)return[this];for(var t=this.amountBaseCurrency/this.splitInDays,n=this.amount/this.splitInDays,r=[new e(y({},this,{amount:n,amountBaseCurrency:t}))],s=1;s<this.splitInDays;s++)r.push(new e(y({},this,{amount:n,amountBaseCurrency:t,when:d.fromTimeMs(this.when).addDays(s).timeMs})));return r}},{key:"info",get:function(){var e=this.amount,t=this.amountBaseCurrency,n=this.categoryId,r=this.countryCode,s=this.currency;return{amount:e,amountBaseCurrency:t,categoryId:n,description:this.description,identifier:this.identifier,when:this.when,countryCode:r,currency:s,budgetId:this.budgetId,splitInDays:this.splitInDays}}},{key:"json",get:function(){return JSON.stringify(this.info)}},{key:"date",get:function(){return this._date||(this._date=d.fromTimeMs(this.when)),this._date}},{key:"day",get:function(){return this.date.day}},{key:"month",get:function(){return this.date.month}},{key:"year",get:function(){return this.date.year}},{key:"dateParts",get:function(){return[this.year,this.month,this.day]}}],[{key:"sum",value:function(e){return Object.values(e).map((function(e){return e.amountBaseCurrency})).reduce((function(e,t){return e+t}))}}]),e}(),g=n(111);function b(e){return(b="function"===typeof Symbol&&"symbol"===typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"===typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function x(e){return(x="function"===typeof Symbol&&"symbol"===b(Symbol.iterator)?function(e){return b(e)}:function(e){return e&&"function"===typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":b(e)})(e)}function _(e,t){return!t||"object"!==x(t)&&"function"!==typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function k(e){return(k=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function m(e,t){return(m=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function w(e,t){if("function"!==typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&m(e,t)}function E(e,t,n){return(E=function(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}()?Reflect.construct:function(e,t,n){var r=[null];r.push.apply(r,t);var s=new(Function.bind.apply(e,r));return n&&m(s,n.prototype),s}).apply(null,arguments)}function O(e){var t="function"===typeof Map?new Map:void 0;return(O=function(e){if(null===e||(n=e,-1===Function.toString.call(n).indexOf("[native code]")))return e;var n;if("function"!==typeof e)throw new TypeError("Super expression must either be null or a function");if("undefined"!==typeof t){if(t.has(e))return t.get(e);t.set(e,r)}function r(){return E(e,arguments,k(this).constructor)}return r.prototype=Object.create(e.prototype,{constructor:{value:r,enumerable:!1,writable:!0,configurable:!0}}),m(r,e)})(e)}var j=function(e){function t(){return Object(u.a)(this,t),_(this,k(t).apply(this,arguments))}return w(t,e),Object(c.a)(t,[{key:"addExpense",value:function(e){var t=e.year,n=this.get(t);void 0===n&&(n=new D,this.set(t,n)),n.addExpense(e)}},{key:"deleteExpense",value:function(e){var t=e.year,n=this.get(t);return!(!n||!n.deleteExpense(e))&&(0===n.size&&this.delete(t),!0)}},{key:"getExpenses",value:function(e){var t=e.year,n=e.month,r=e.day,s=this.get(t);if(s){var i=s.get(n);if(i)return i.get(r)}}},{key:"getAllGroupedByDate",value:function(e,n,r){var s=new T;if(void 0===n){var i=this.get(e);if(i){var a=!0,o=!1,u=void 0;try{for(var c,f=i.values()[Symbol.iterator]();!(a=(c=f.next()).done);a=!0){var h=c.value;t.addDailyExpensesByDate(h,s)}}catch(y){o=!0,u=y}finally{try{a||null==f.return||f.return()}finally{if(o)throw u}}}}else if(void 0===r){var l=this.get(e);if(l){var d=l.get(n);d&&t.addDailyExpensesByDate(d,s)}}else{var p=this.getExpenses({year:e,month:n,day:r});p&&t.addExpensesByDate(p.values(),s)}return s}},{key:"getExpense",value:function(e,t){var n=this.getExpenses(e);if(n)return n.get(t)}},{key:"getMonths",value:function(e){var t=this.get(e);return t?t.keys():[]}},{key:"getDays",value:function(e,t){var n=this.get(e);if(n){var r=n.get(t);return r?r.keys():[]}return[]}},{key:"years",get:function(){return this.keys()}}],[{key:"addDailyExpensesByDate",value:function(e,n){var r=!0,s=!1,i=void 0;try{for(var a,o=e.values()[Symbol.iterator]();!(r=(a=o.next()).done);r=!0){var u=a.value;t.addExpensesByDate(u.values(),n)}}catch(c){s=!0,i=c}finally{try{r||null==o.return||o.return()}finally{if(s)throw i}}}},{key:"addExpensesByDate",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:new T,n=!0,r=!1,s=void 0;try{for(var i,a=e[Symbol.iterator]();!(n=(i=a.next()).done);n=!0){var o=i.value,u=t.get(o.when);u||(u=new Map,t.set(o.when,u)),u.set(o.identifier,o)}}catch(c){r=!0,s=c}finally{try{n||null==a.return||a.return()}finally{if(r)throw s}}return t}}]),t}(O(Map)),D=function(e){function t(){return Object(u.a)(this,t),_(this,k(t).apply(this,arguments))}return w(t,e),Object(c.a)(t,[{key:"addExpense",value:function(e){var t=e.month,n=this.get(t);void 0===n&&(n=new T,this.set(t,n)),n.addExpense(e)}},{key:"deleteExpense",value:function(e){var t=e.month,n=this.get(t);return!(!n||!n.deleteExpense(e))&&(0===n.size&&this.delete(t),!0)}}]),t}(O(Map)),T=function(e){function t(){return Object(u.a)(this,t),_(this,k(t).apply(this,arguments))}return w(t,e),Object(c.a)(t,[{key:"addExpense",value:function(e){var t=e.day,n=this.get(t);void 0===n&&(n=new Map,this.set(t,n)),n.set(e.identifier,e)}},{key:"deleteExpense",value:function(e){var t=e.day,n=e.identifier,r=this.get(t);return!(!r||!r.delete(n))&&(0===r.size&&this.delete(t),!0)}}]),t}(O(Map)),B=function(){function e(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[];Object(u.a)(this,e),this._info=void 0,this._expenses=void 0,this._expenseGroups=void 0,this._nestedTotalExpenses=void 0,this._days=void 0,this._totalDays=void 0,this._info=t,this._expenses=new Map;var r=!0,s=!1,i=void 0;try{for(var a,o=n[Symbol.iterator]();!(r=(a=o.next()).done);r=!0){var c=a.value;this._expenses.set(c.identifier,new v(c))}}catch(f){s=!0,i=f}finally{try{r||null==o.return||o.return()}finally{if(s)throw i}}}return Object(c.a)(e,[{key:"getTotalExpenses",value:function(e,t,n){var r=[e];return void 0!==t&&r.push(t),void 0!==n&&r.push(n),this.nestedTotalExpenses.getSubtotal(r)}},{key:"getExpensesByDay",value:function(e,t,n){return void 0===e?j.addExpensesByDate(this._expenses.values()):this.expenseGroups.getAllGroupedByDate(e,t,n)}},{key:"_updateTotalExpenses",value:function(e,t){void 0!==t&&t.splitInDays===e.splitInDays&&t.amountBaseCurrency===e.amountBaseCurrency&&t.when===e.when&&t.categoryId===e.categoryId&&t.countryCode===e.countryCode||(t&&this._subtractTotal(t),this._addToTotal(e))}},{key:"setExpense",value:function(e){var t=new v(e),n=this._expenses.get(e.identifier);if(n){var r=n.split(),s=!0,i=!1,a=void 0;try{for(var o,u=r[Symbol.iterator]();!(s=(o=u.next()).done);s=!0){var c=o.value;this.expenseGroups.deleteExpense(c)}}catch(g){i=!0,a=g}finally{try{s||null==u.return||u.return()}finally{if(i)throw a}}this._updateTotalExpenses(t,n)}else this._updateTotalExpenses(t);var f=!0,h=!1,l=void 0;try{for(var d,p=t.split()[Symbol.iterator]();!(f=(d=p.next()).done);f=!0){var y=d.value;this.expenseGroups.addExpense(y)}}catch(g){h=!0,l=g}finally{try{f||null==p.return||p.return()}finally{if(h)throw l}}this._expenses.set(e.identifier,t)}},{key:"getExpense",value:function(e){var t=this._expenses.get(e);if(t)return t;throw new Error('Expense with ID "'.concat(e,'" not found'))}},{key:"deleteExpense",value:function(e){var t=this._expenses.get(e);return!(!t||!this._expenses.delete(e))&&(this._subtractTotal(t),this.expenseGroups.deleteExpense(t),!0)}},{key:"_updateExpensesBaseAmount",value:function(t){var n=new l,r=!0,s=!1,i=void 0;try{for(var a,o=this._expenses.values()[Symbol.iterator]();!(r=(a=o.next()).done);r=!0){var u=a.value;u.amountBaseCurrency=e._getBaseAmount(u,t),u.addToTotals(n)}}catch(c){s=!0,i=c}finally{try{r||null==o.return||o.return()}finally{if(s)throw i}}this._nestedTotalExpenses=n}},{key:"_addToTotal",value:function(e){e.inBudgetDates(this._info)&&e.addToTotals(this.nestedTotalExpenses)}},{key:"_subtractTotal",value:function(e){e.inBudgetDates(this._info)&&e.subtractTotal(this.nestedTotalExpenses)}},{key:"setBudget",value:function(){var e=Object(o.a)(a.a.mark((function e(t,n){return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t.identifier===this.identifier){e.next=2;break}throw new Error("Cannot update budget information with different IDs");case 2:if(t.currency===this._info.currency){e.next=7;break}if(n){e.next=5;break}throw new Error("Required conversion rates to update budget currency");case 5:this._updateExpensesBaseAmount(n),this._info.currency=t.currency;case 7:return this._info.name=t.name,this._info.total=t.total,this._info.from!==t.from&&(this._days=this._totalDays=void 0,this._info.from=t.from),this._info.to!==t.to&&(this._days=this._totalDays=void 0,this._info.to=t.to),e.abrupt("return",Promise.resolve());case 12:case"end":return e.stop()}}),e,this)})));return function(t,n){return e.apply(this,arguments)}}()},{key:"export",value:function(e){var t={};return this._expenses.forEach((function(e,n){return t[n]=e.info})),{budgets:Object(r.a)({},this.identifier,this.info),expenses:t,categories:e,lastTimeSaved:Date.now()}}},{key:"numberOfExpenses",get:function(){return this._expenses.size}},{key:"identifier",get:function(){return this._info.identifier}},{key:"currency",get:function(){return this._info.currency}},{key:"from",get:function(){return this._info.from}},{key:"name",get:function(){return this._info.name}},{key:"to",get:function(){return this._info.to}},{key:"total",get:function(){return this._info.total}},{key:"info",get:function(){return this._info}},{key:"expenses",get:function(){return this._expenses.values()}},{key:"totalExpenses",get:function(){return this.nestedTotalExpenses.total}},{key:"nestedTotalExpenses",get:function(){var e=this;return void 0===this._nestedTotalExpenses&&(this._nestedTotalExpenses=new l,this._expenses.forEach((function(t){return e._addToTotal(t)}))),this._nestedTotalExpenses}},{key:"daysUntilToday",get:function(){return this._days||(this._days=h(this._info.from,Date.now())),this._days}},{key:"totalDays",get:function(){return this._totalDays||(this._totalDays=h(this._info.from,this._info.to)),this._totalDays}},{key:"average",get:function(){return this.daysUntilToday>0&&this.totalExpenses>0?Math.round(this.totalExpenses/this.daysUntilToday):0}},{key:"expectedDailyExpensesAverage",get:function(){return Math.round(this._info.total/this.totalDays)}},{key:"expenseGroups",get:function(){if(!this._expenseGroups){var e=new j;this._expenses.forEach((function(t){return t.split().forEach((function(t){return e.addExpense(t)}))})),this._expenseGroups=e}return this._expenseGroups}}],[{key:"_getBaseAmount",value:function(e,t){var n=e.currency,r=e.amount;if(t.base===n)return r;var s=t.rates[n];if(void 0===s)throw new Error("Cannot get currency exchange rate from ".concat(t.base," to ").concat(n));return Object(g.a)(r,s)}}]),e}();function S(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function M(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?S(n,!0).forEach((function(t){Object(r.a)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):S(n).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}n.d(t,"BudgetsStoreImpl",(function(){return I}));var I=function(){function e(t){Object(u.a)(this,e),this._budgetModels=void 0,this._app=void 0,this._storage=void 0,this._budgetModels=new Map,this._app=t,this._storage=t.storage,this._storage.addObserver(this)}return Object(c.a)(e,[{key:"onStorageDataChanged",value:function(){this._budgetModels.clear()}},{key:"getBudgetsIndex",value:function(){var e=Object(o.a)(a.a.mark((function e(){return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",this._storage.getBudgets());case 1:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"getBudgetModel",value:function(){var e=Object(o.a)(a.a.mark((function e(t){var n,r,s;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(void 0!==(n=this._budgetModels.get(t))){e.next=14;break}return e.next=4,this._storage.getBudget(t);case 4:return r=e.sent,e.next=7,this._storage.getExpenses(t);case 7:if(s=e.sent,!r){e.next=13;break}n=new B(r,Object.values(s)),this._budgetModels.set(t,n),e.next=14;break;case 13:throw new Error("Budget not found: "+t);case 14:return e.abrupt("return",n);case 15:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()},{key:"setBudget",value:function(){var e=Object(o.a)(a.a.mark((function e(t){var n,r;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!(n=this._budgetModels.get(t.identifier))){e.next=14;break}if(r=void 0,n.currency===t.currency){e.next=10;break}return e.next=6,this._app.getCurrenciesStore();case 6:return e.t0=t.currency,e.next=9,e.sent.getRates(e.t0);case 9:r=e.sent;case 10:return e.next=12,n.setBudget(t,r);case 12:e.next=15;break;case 14:this._budgetModels.set(t.identifier,new B(t));case 15:return e.abrupt("return",this._storage.setBudget(t));case 16:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()},{key:"getExpenses",value:function(){var e=Object(o.a)(a.a.mark((function e(t){return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.getBudgetModel(t);case 2:return e.abrupt("return",e.sent.expenses);case 3:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()},{key:"getExpensesByDay",value:function(){var e=Object(o.a)(a.a.mark((function e(t,n){var r,s;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.getBudgetModel(t);case 2:if(!(r=e.sent).expenseGroups){e.next=7;break}if(!(s=r.expenseGroups.getExpenses(n))){e.next=7;break}return e.abrupt("return",s);case 7:throw new Error("No expenses found");case 8:case"end":return e.stop()}}),e,this)})));return function(t,n){return e.apply(this,arguments)}}()},{key:"setExpenses",value:function(){var e=Object(o.a)(a.a.mark((function e(t,n){var r,s,i,o,u,c,f;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.getBudgetModel(t);case 2:for(r=e.sent,s=!0,i=!1,o=void 0,e.prev=6,u=n[Symbol.iterator]();!(s=(c=u.next()).done);s=!0)f=c.value,r.setExpense(f);e.next=14;break;case 10:e.prev=10,e.t0=e.catch(6),i=!0,o=e.t0;case 14:e.prev=14,e.prev=15,s||null==u.return||u.return();case 17:if(e.prev=17,!i){e.next=20;break}throw o;case 20:return e.finish(17);case 21:return e.finish(14);case 22:return e.abrupt("return",this._storage.setExpenses(n));case 23:case"end":return e.stop()}}),e,this,[[6,10,14,22],[15,,17,21]])})));return function(t,n){return e.apply(this,arguments)}}()},{key:"getExpense",value:function(){var e=Object(o.a)(a.a.mark((function e(t,n){return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.getBudgetModel(t);case 2:return e.t0=n,e.abrupt("return",e.sent.getExpense(e.t0));case 4:case"end":return e.stop()}}),e,this)})));return function(t,n){return e.apply(this,arguments)}}()},{key:"deleteBudget",value:function(){var e=Object(o.a)(a.a.mark((function e(t){return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return this._budgetModels.delete(t),e.abrupt("return",this._storage.deleteBudget(t));case 2:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()},{key:"deleteExpense",value:function(){var e=Object(o.a)(a.a.mark((function e(t,n){return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.getBudgetModel(t);case 2:return e.sent.deleteExpense(n),e.abrupt("return",this._storage.deleteExpense(n));case 5:case"end":return e.stop()}}),e,this)})));return function(t,n){return e.apply(this,arguments)}}()},{key:"setBudgets",value:function(){var e=Object(o.a)(a.a.mark((function e(t){var n=this;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",Promise.all(t.map((function(e){return n.setBudget(e)}))));case 1:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()},{key:"setExpensesList",value:function(){var e=Object(o.a)(a.a.mark((function e(t){var n=this;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",Promise.all(t.map((function(e){return n.setExpense(e)}))));case 1:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()},{key:"setExpense",value:function(){var e=Object(o.a)(a.a.mark((function e(t){return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.getBudgetModel(t.budgetId);case 2:return e.sent.setExpense(t),e.abrupt("return",this._storage.setExpenses([t]));case 5:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()},{key:"import",value:function(){var e=Object(o.a)(a.a.mark((function e(t){var n,r,i,o;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=t.budgets,r=t.expenses,i=t.categories,o=Object.entries(i).map((function(e){var t=Object(s.a)(e,2);return M({identifier:t[0]},t[1])})),e.t0=Promise,e.t1=this.setBudgets(Object.values(n)),e.t2=this.setExpensesList(Object.values(r)),e.next=7,this._app.getCategoriesStore();case 7:return e.t3=o,e.t4=e.sent.setCategories(e.t3),e.t5=[e.t1,e.t2,e.t4],e.next=12,e.t0.all.call(e.t0,e.t5);case 12:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()},{key:"export",value:function(){var e=Object(o.a)(a.a.mark((function e(){var t,n,r,s,i,o,u,c,f,h,l,d,p,y,v=this;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.t0={},e.t1={},e.next=4,this._app.getCategoriesStore();case 4:return e.next=6,e.sent.getCategories();case 6:return e.t2=e.sent,e.t3=Date.now(),t={budgets:e.t0,expenses:e.t1,categories:e.t2,lastTimeSaved:e.t3},e.t4=Promise,e.t5=Object,e.next=13,this.getBudgetsIndex();case 13:return e.t6=e.sent,e.t7=function(e){return v.getBudgetModel(e)},e.t8=e.t5.keys.call(e.t5,e.t6).map(e.t7),e.next=18,e.t4.all.call(e.t4,e.t8);case 18:n=e.sent,r=!0,s=!1,i=void 0,e.prev=22,o=n[Symbol.iterator]();case 24:if(r=(u=o.next()).done){e.next=49;break}for(c=u.value,t.budgets[c.identifier]=c.info,f=!0,h=!1,l=void 0,e.prev=30,d=c.expenses[Symbol.iterator]();!(f=(p=d.next()).done);f=!0)y=p.value,t.expenses[y.identifier]=y.info;e.next=38;break;case 34:e.prev=34,e.t9=e.catch(30),h=!0,l=e.t9;case 38:e.prev=38,e.prev=39,f||null==d.return||d.return();case 41:if(e.prev=41,!h){e.next=44;break}throw l;case 44:return e.finish(41);case 45:return e.finish(38);case 46:r=!0,e.next=24;break;case 49:e.next=55;break;case 51:e.prev=51,e.t10=e.catch(22),s=!0,i=e.t10;case 55:e.prev=55,e.prev=56,r||null==o.return||o.return();case 58:if(e.prev=58,!s){e.next=61;break}throw i;case 61:return e.finish(58);case 62:return e.finish(55);case 63:return e.abrupt("return",t);case 64:case"end":return e.stop()}}),e,this,[[22,51,55,63],[30,34,38,46],[39,,41,45],[56,,58,62]])})));return function(){return e.apply(this,arguments)}}()}]),e}()}}]);
//# sourceMappingURL=6.a19d7880.chunk.js.map