# [3.9.4] - 2020-04-16
## Update
- Fix vulnerability on minimist dependency https://github.com/advisories/GHSA-vh95-rmgr-6w4m.
## Fix
- Fix bug counting number of total expenses.

# [3.9.3] - 2020-03-14
## Update
- Code refactoring: use async/await syntax instead fo old promises one.

# [3.9.2] - 2020-03-14
## Fix
- Date difference calculation.
- Bump dependencies with vulnerabilities bugfixes.

# [3.9.0] - 2019-12-13
## Add
- New fallback currency APIs.

## Change
- Upgrade dependencies.

# [3.8.4] - 2019-12-10
## Add
- Add Yandex code.

# [3.8.3] - 2019-12-10
## Fix
- Add missing translation for 'days'.

## Change
- Use device language to show dates.

# [3.8.2] - 2019-12-09
## Fix
- Cleanup old deleted entities.

# [3.8.1] - 2019-12-02
## Change
- Bump dependencies.

# [3.8.0] - 2019-12-01
## Add
- Add index to database to speed up filtering entities by timestamp and deleted flag.
- Old deleted entities cleaning up on application startup.

## Change
- Better IndexedDB version upgrade handling.

## Fix
- After local database is removed, allow user to get data remotely by setting local timestamp to 0, so data will be fetched.

# [3.7.3] - 2019-12-01
## Change
- Show local persistence state.

# [3.7.2] - 2019-11-28
## Add
- Currency default names.

# [3.7.1] - 2019-11-23
## Change
- Change loading currencies from static file to use currencies-map library.
- Upgrade dependencies.

# [3.7.0] - 2019-11-23
## Change
- Expense form organization and styling.
## Fix
- Regression: Guess current country on new expense creation.

# [3.6.0] - 2019-11-21
## Add
- Ability to navigate to expenses by category from budget stats view.
- Use auto complete for categories selection.

# [3.5.0] - 2019-11-21
## Add
- Use auto complete for currencies and countries selection.

# [3.4.0] - 2019-11-20
## Add
- Allow to edit expenses outside of budget dates range.

# [3.3.0] - 2019-11-19
## Fix
- Race condition changing currencies and amounts in expense form.

## Change
- Switch from api.currencystack.io to api.exchangeratesapi.io.
- Improve error messages when there is an error getting rates.

# [3.2.1] - 2019-11-11
## Change
- Budgets in budget list view are sorted by end date.

# [3.2.0] - 2019-11-11
## Add
- Now you can move en expense from a budget to other.

# [3.1.0] - 2019-11-10
## Changed
- Show when a budget end date is in the past in budgets list.

## Fix
- Number of days left in a budget where not shown correctly, when the budget was in the past: https://github.com/carlosvin/budget-tracker/issues/153.

# [3.0.1] - 2019-10-24
## Changed
- Use same manifest base color in MUI theme.
- Upgrade dependencies.

# [3.0.0] - 2019-10-18
## Changed
- Application moved to [https://btapp.netlify.com](btapp.netlify.com).
- Upgrade dependencies.

# [2.15.3] - 2019-10-17
## Fix
- Expenses by date view was not showing split expenses.

# [2.15.2] - 2019-10-16
## Fix
- Statistics calculations: Expenses daily average, ignore when there are more than one country in same day. 

# [2.15.1] - 2019-10-16
## Fix
- After fetching rates from backup API, missing ones were cleared out.

# [2.15.0] - 2019-10-15
## Add
- Keep list with last currencies saved.

# [2.14.1] - 2019-10-13
## Fix
- Edit split in days didn't update budget view.
- Category change was not reflected in expense form.

# [2.14.0] - 2019-10-12
## Add
- Contextual navigation to expenses by category and date.

## Change
- Small styling changes.

## Fix
- Expenses list navigation backwards and forwards.

# [2.13.0] - 2019-10-08
## Add
- Translation support.
- Supported languages: es, en.

## Fix 
- Combined budget view error.

# [2.12.2] - 2019-10-06
## Changed
- Performance improvements.

## Add
- Sitemap.xml.

# [2.12.1] - 2019-10-06
## Fix
- Remove wrong index.html head data.

# [2.12.0] - 2019-10-05
## Add
- About page with budget tracker relevant information.
- GNU License.

# [2.11.0] - 2019-10-04
## Fix
- Code cleanup. Review TODOs in code. Remove or fix them.

## Delete
- Heat map chart until Frappe Charts make this component responsive.

# [2.10.1] - 2019-10-01
## Fix
- Calculation of exchange rates fetch period. Previously it was fetching rates each time expense view was loaded.

# [2.10.0] - 2019-10-01
## Change
- Do not split expense in smaller expenses. Now we can modify the number of split days in any moment, not only during expense creation.

# [2.9.0] - 2019-09-29
## Change
- Refresh currency exchange rates twice per day.
- Apply local number formatting for amounts and currencies.
- Update currencies data map.

## Fix
- Fix expense split field warnings.

# [2.8.2] - 2019-09-28
## Fix
- Amount input didn't allow field cleanup.

# [2.8.1] - 2019-09-27
## Change
- Improve amount input with currency removing unnecessary state
- Show checkbox only when there is more than one budget to select

## Fix
- Fix delayed currency loading when it is detected from current country- 
- Use margin bottom so Fab buttons don't hide relevant content.

# [2.8.0] - 2019-09-26
## Fix
- Firestore error when while importing. Firestore is limited by 500 write requests per batch. 

## Add
- Currency internationalization formatting.

# [2.7.0] - 2019-09-25
## Add
- Expenses heat map chart.

# [2.6.0] - 2019-09-25
## Add
- New statistics chart showing daily expenses average per country.

## Fix
- Cleanup React warnings.

# [2.5.0] - 2019-09-23
## Changed
- Request permission to use persistent storage, so user data stored in Indexed DB won't get lost.
- Change statistics view to use [frappe-charts](https://frappe.io/charts).

# [2.4.2] - 2019-09-23
## Fixed
- Export data directly from import/export view, without accessing first to budget model. 

# [2.4.1] - 2019-09-22
## Changed
- Application services instantiation. 

# [2.4.0] - 2019-09-21
## Added
- Allow to combine budgets and show combined statistics

## Fixed
- Create expense when offline
- Import data in old category format

## Changed
- Updated changelog file format.

# [2.3.0] - 2019-09-17
## Added
- Save buttons in forms are disabled while there are no changes in the form.

## Technical
- Replace axios library by fetch API.

# [2.2.0] - 2019-09-16

## Changed
- After storage is synchronized, views show updated information.

# [2.0.0] - 2019-09-10 

## Changed
- [BC] Export data to file, so later it could be imported to IndexedDB.
- [BC]: Category.id renamed to Category.identifier.
- Since there are no production users, there is no migration mechanism in the application. You should [export your current budgets](https://carlosvin.github.io/budget-tracker/import-export) to a file and imported later in new version.

# [1.3.0]

## Changed
- Import data is not overriding budgets anymore, not budgets and categories are merged.
- Import export UI improvements.

# [1.2.0]

## Added
- Now you can export whole application or single budget data.
- Better error handling for firestore API.

# [1.1.1]
## Fixed
- Primary storage is local, so application doesn't care if a transient remote error happens, it will synchronize data later.

# [1.1.0]
## Added
- Allow signed in users to sync its data remotely in Firestore.
