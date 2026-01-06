# Database Documentation

## ✅ Current Solution: Custom JSON Database

**No external database required!** The backend currently uses a **Custom JSON File Database** (`database-simple.js`). This is a fully self-hosted, file-based solution designed to work without complex dependencies like Python or C++ compilers.

## 📊 Technical Stack

### Database: JSON Files
- **Type**: Local File-based JSON Storage
- **Location**: `server/data/applications.json`
- **Features**:
  - ✅ **No Installation**: Works instantly with Node.js.
  - ✅ **Zero Configuration**: No setup required.
  - ✅ **Lightweight**: Simple text files.
  - ✅ **Portable**: Easy to backup (just copy the file).
  - ✅ **Compatibility**: Mimics the SQLite API structure for easy future migration.

### File Storage: Local Disk
- **Location**: `server/uploads/`
- **Description**: Uploaded files (PDFs, Images) are saved directly to the server's local disk.

### Authentication: JWT (jsonwebtoken)
- **Type**: Token-based authentication
- **Description**: Secure admin login without external services.

## 🤔 JSON DB vs. Other Solutions

### JSON Database (Current)

**Pros:**
- ✅ **Free** - 100% free to use.
- ✅ **Simple** - No external dependencies (fixes the `gyp/python` errors).
- ✅ **Fast** - Direct file access for small to medium datasets.
- ✅ **Independent** - Data lives on your server.
- ✅ **Easy Backup** - Just copy the `server/data` folder.

**Cons:**
- ❌ **Scalability** - Not suitable for millions of records (but perfect for thousands).
- ❌ **Concurrency** - Single-threaded file writing (fine for low traffic).

**Ideal For:**
- ✅ Small to Medium applications (like this Academy application system).
- ✅ Single server deployments.
- ✅ Quick setup and development.

### Future Migration Options (If needed)

If your application grows significantly (e.g., > 100,000 applications), you can migrate to:

1.  **SQLite (better-sqlite3)**:
    - If you install Python/C++ build tools later, you can switch back to the SQLite implementation (`database.js`).
    - *Migration*: Convert JSON data to SQLite tables.

2.  **PostgreSQL / MySQL**:
    - For high-performance, multi-server setups.
    - *Migration*: Export JSON to SQL import scripts.

## 📝 Architecture Summary

```
┌─────────────────┐
│   Frontend      │
│   (React/Vite)  │
└────────┬────────┘
         │ HTTP/API
         ▼
┌─────────────────┐
│   Backend       │
│   (Node.js)     │
│   - Express     │
│   - JSON DB     │
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌────────┐ ┌─────────┐
│ JSON   │ │ Uploads │
│ File   │ │  Files  │
└────────┘ └─────────┘

All data is local! 
No cloud dependencies!
```

## ✅ Conclusion

**For this project:**
- ✅ **JSON Database is sufficient.**
- ✅ **Zero Cost.**
- ✅ **High Reliability.**
- ✅ **Easy to Manage.**
