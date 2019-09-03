
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
