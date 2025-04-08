# razzly-backend

# Part- 1

- /api/generate_shorturl
- long_url => hash -> 7letters -> mongodb

  - Table Fields
    - shortUrl
    - longUrl
    - createdAt
    - createdBy :{name,email}
    - isActive
    - userId : uid

- /api/get_url/<short_url>
- short_url => look for long_url => increment Visits => find country => deviceType => browserType => referar
- Table Fiedls (Visits)

  - total_visits
  - date
  - country
  - deviceType
  - browbserType
  - referar

- /api/v1/bulk-analysis
- overall clicks last 7 day
- overall country
- overall deviceType
- overall browserType
- overall referar
