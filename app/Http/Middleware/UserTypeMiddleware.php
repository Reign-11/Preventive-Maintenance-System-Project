<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Closure;
use Illuminate\Support\Facades\Auth;



class UserTypeMiddleware
{
    public function handle (Request $request, Closure $next, $role)
    {
        if (Auth:: check () && Auth :: user () ->role == $role) {
            return $next($request);
        }

        return abort (403, 'Unauthorized Access');
    }
    
}
