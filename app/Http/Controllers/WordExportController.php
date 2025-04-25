<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

class WordExportController extends Controller
{
    public function print()
    {
        $pdf = Pdf::loadView('pdf.print-view'); // Make sure the view path is correct
        return $pdf->stream('print-view.pdf'); // opens the PDF in the browser
    }
}
