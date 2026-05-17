# Data Model

## Entities

### User (Student)
- `id`: String (UUID) - Primary Key
- `name`: String - 中文姓名
- `birthday`: String - 生日 (YYYYMMDD)
- `parentPhone`: String - 家長電話
- `createdAt`: DateTime

### Booking
- `id`: String (UUID) - Primary Key
- `userId`: String (Foreign Key to User)
- `date`: String - 預約日期 (YYYY-MM-DD)
- `slot`: Int - 時段 (1 或 2)
- `companionGroupId`: String (UUID, Optional) - Used to link two companion bookings together for joint cancellation.
- `createdAt`: DateTime

## Relationships
- A `User` can have multiple `Booking`s.
- Each `Booking` belongs to one `User`.

## Constraints
- Unique constraint on `Booking` for `(date, slot)` to prevent double booking.
- Unique constraint on `Booking` for `(userId, date)` to enforce one slot per day per user.
- `name` + `birthday` is used to identify a returning user during authentication.
