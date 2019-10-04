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
