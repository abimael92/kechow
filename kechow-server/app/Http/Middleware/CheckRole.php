class CheckRole
{
    public function handle($request, Closure $next, ...$roles)
    {
        if (!in_array(auth()->user()->role, $roles)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        return $next($request);
    }
}

// Apply in controllers
public function __construct()
{
    $this->middleware('auth:sanctum');
    $this->middleware('role:owner')->only(['store', 'update', 'destroy']);
}
