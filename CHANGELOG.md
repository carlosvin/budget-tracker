2.2.0 Update views after data sync
----------------------------------
- After storage is synchronized, views show up to date information.s 

2.1.0 Improve data synchronization
----------------------------------
- Read/Write only changed remote data, so Budget Tracker saves network data and Firestore quota. 

2.0.0 Replace LocalStore by IndexedDB
--------------------------------------
- BC: Export data to file, so later it could be imported to IndexedDB.
- BC: Category.id renamed to Category.identifier.
- Since there are no production users, there is no migration mechanism in the application. You should [export your current budgets](https://carlosvin.github.io/budget-tracker/import-export) to a file and imported later in new version.

1.3.0 Import/export merge
-------------------------
- Import data is not overriding budgets anymore, not budgets and categories are merged.
- Import export UI improvements.

1.2.0 Import/export UI changes
-----------------------------------
- Now you can export whole application or single budget data.
- Import/Export views refactored to be independent cards.
- Better error handling for firestore API.

1.1.1 Ignore remote storage errors
-----------------------------------
Primary storage is local, so application doesn't care if a transient remote error happens, it will synchronize data later.


1.1.0 Account sync
------------------
Allow signed in users to sync its data remotely in Firestore.
