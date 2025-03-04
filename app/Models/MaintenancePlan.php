<?php
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MaintenancePlan extends Model
{
    use HasFactory;

    protected $table = 'tbl_premainplan'; // Table name
    protected $primaryKey = 'PlanId'; // Primary key
    public $timestamps = false; // Disable timestamps if not used

    protected $fillable = [
        'PlanId', 'CatId', 'OffId', 'YrId', // Foreign keys
        'Officename','January', 'February', 'March', 'April',
        'May', 'June', 'July', 'August', 'September', 
        'October', 'November', 'December',
    ];

    // ✅ Relationship: A MaintenancePlan belongs to an Office
    public function office()
    {
        return $this->belongsTo(Office::class, 'OffId', 'id'); // Adjust foreign key if needed
    }
    public function category()
    {
        return $this->belongsTo(category::class, 'CatId', 'id'); // Adjust foreign key if needed
    }
    public function Year()
    {
        return $this->belongsTo(Year::class, 'YrId  ', 'id'); // Adjust foreign key if needed
    }

    // ✅ Query Scope for Filtering
    public function scopeFilter($query, $CatId, $YrId, $OffId)
    {
        return $query->where('CatId', $CatId)
                     ->where('YrId', $YrId)
                     ->where('OffId', $OffId);
    }
}

