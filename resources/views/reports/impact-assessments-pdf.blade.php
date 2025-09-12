<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Impact Assessments Report</title>
    <style>
        body {
            font-family: 'DejaVu Sans', Arial, sans-serif;
            font-size: 10px;
            margin: 0;
            padding: 20px;
            color: #333;
        }

        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
        }

        .header h1 {
            margin: 0 0 10px 0;
            font-size: 24px;
            color: #1a365d;
        }

        .header p {
            margin: 5px 0;
            font-size: 12px;
            color: #666;
        }

        .statistics {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
        }

        .stat-item {
            text-align: center;
            flex: 1;
        }

        .stat-item h3 {
            margin: 0 0 5px 0;
            font-size: 20px;
            color: #1a365d;
        }

        .stat-item p {
            margin: 0;
            font-size: 10px;
            color: #666;
        }

        .filters {
            margin-bottom: 20px;
            padding: 10px;
            background-color: #e8f4f8;
            border-left: 4px solid #3182ce;
        }

        .filters h3 {
            margin: 0 0 10px 0;
            font-size: 12px;
            color: #1a365d;
        }

        .filter-item {
            display: inline-block;
            margin-right: 15px;
            margin-bottom: 5px;
            font-size: 9px;
        }

        .filter-item strong {
            color: #1a365d;
        }

        .table-container {
            margin-top: 20px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            font-size: 9px;
        }

        th,
        td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
            vertical-align: top;
        }

        th {
            background-color: #f8f9fa;
            font-weight: bold;
            color: #1a365d;
            font-size: 9px;
        }

        tr:nth-child(even) {
            background-color: #f9f9f9;
        }

        tr:hover {
            background-color: #f5f5f5;
        }

        .partner-name {
            font-weight: bold;
            color: #1a365d;
        }

        .activity {
            color: #666;
            font-size: 8px;
            margin-top: 2px;
        }

        .location {
            color: #2d3748;
            font-weight: 500;
        }

        .institution {
            font-size: 8px;
        }

        .campus {
            color: #2d3748;
            font-weight: 500;
        }

        .college {
            color: #666;
            font-style: italic;
        }

        .participants {
            color: #2d3748;
            font-weight: 500;
        }

        .committee {
            color: #666;
            font-size: 8px;
            margin-top: 2px;
        }

        .duration {
            color: #2d3748;
        }

        .created-info {
            font-size: 8px;
            color: #666;
        }

        .created-by {
            color: #4a5568;
            font-weight: 500;
        }

        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 8px;
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 10px;
        }

        .page-break {
            page-break-before: always;
        }

        .no-data {
            text-align: center;
            padding: 40px;
            color: #666;
            font-style: italic;
        }
    </style>
</head>

<body>
    <!-- Header -->
    <div class="header">
        <h1>Impact Assessments Report</h1>
        <p>Comprehensive overview of all impact assessment activities</p>
        <p>Generated on {{ $generated_at }} by {{ $generated_by }}</p>
    </div>

    <!-- Filters Applied -->
    @if (!empty(array_filter($filters)))
        <div class="filters">
            <h3>Filters Applied:</h3>
            @if (!empty($filters['search']))
                <div class="filter-item">
                    <strong>Search:</strong> {{ $filters['search'] }}
                </div>
            @endif
            @if (!empty($filters['campus_id']))
                @php
                    $campus = \App\Models\Campus::find($filters['campus_id']);
                @endphp
                @if ($campus)
                    <div class="filter-item">
                        <strong>Campus:</strong> {{ $campus->name }}
                    </div>
                @endif
            @endif
            @if (!empty($filters['college_id']))
                @php
                    $college = \App\Models\College::find($filters['college_id']);
                @endphp
                @if ($college)
                    <div class="filter-item">
                        <strong>College:</strong> {{ $college->name }}
                    </div>
                @endif
            @endif
            @if (!empty($filters['project_id']))
                @php
                    $project = \App\Models\Project::find($filters['project_id']);
                @endphp
                @if ($project)
                    <div class="filter-item">
                        <strong>Project:</strong> {{ $project->name }}
                    </div>
                @endif
            @endif
            @if (!empty($filters['direct_min']))
                <div class="filter-item">
                    <strong>Min Direct Beneficiaries:</strong> {{ number_format($filters['direct_min']) }}
                </div>
            @endif
            @if (!empty($filters['direct_max']))
                <div class="filter-item">
                    <strong>Max Direct Beneficiaries:</strong> {{ number_format($filters['direct_max']) }}
                </div>
            @endif
            @if (!empty($filters['indirect_min']))
                <div class="filter-item">
                    <strong>Min Indirect Beneficiaries:</strong> {{ number_format($filters['indirect_min']) }}
                </div>
            @endif
            @if (!empty($filters['indirect_max']))
                <div class="filter-item">
                    <strong>Max Indirect Beneficiaries:</strong> {{ number_format($filters['indirect_max']) }}
                </div>
            @endif
            @if (!empty($filters['date_from']))
                <div class="filter-item">
                    <strong>From Date:</strong> {{ date('M d, Y', strtotime($filters['date_from'])) }}
                </div>
            @endif
            @if (!empty($filters['date_to']))
                <div class="filter-item">
                    <strong>To Date:</strong> {{ date('M d, Y', strtotime($filters['date_to'])) }}
                </div>
            @endif
            @if (!empty($filters['sort_by']))
                <div class="filter-item">
                    <strong>Sort By:</strong> {{ ucfirst(str_replace('_', ' ', $filters['sort_by'])) }}
                    ({{ $filters['sort_order'] ?? 'desc' }})
                </div>
            @endif
        </div>
    @endif

    <!-- Impact Assessments Table -->
    <div class="table-container">
        @if ($assessments->count() > 0)
            <table>
                <thead>
                    <tr>
                        <th style="width: 25%">Project & Beneficiary</th>
                        <th style="width: 15%">Geographic Coverage</th>
                        <th style="width: 18%">College</th>
                        <th style="width: 12%">Impact Beneficiaries</th>
                        <th style="width: 12%">Total Impact</th>
                        <th style="width: 18%">Created</th>
                    </tr>
                </thead>
                <tbody>
                    @php
                        $totalDirect = 0;
                        $totalIndirect = 0;
                    @endphp
                    @foreach ($assessments as $assessment)
                        @php
                            $totalDirect += $assessment->num_direct_beneficiary;
                            $totalIndirect += $assessment->num_indirect_beneficiary;
                        @endphp
                        <tr>
                            <td>
                                <div class="partner-name">{{ $assessment->project->name ?? 'N/A' }}</div>
                                @if ($assessment->beneficiary)
                                    <div class="activity">{{ Str::limit($assessment->beneficiary, 80) }}</div>
                                @endif
                            </td>
                            <td class="location">
                                {{ $assessment->geographic_coverage ?? 'Not specified' }}
                            </td>
                            <td class="institution">
                                <div class="campus">
                                    {{ $assessment->project->campusCollege->campus->name ?? 'N/A' }}
                                </div>
                                <div class="college">
                                    {{ $assessment->project->campusCollege->college->name ?? 'N/A' }}
                                </div>
                            </td>
                            <td>
                                <div class="participants">
                                    Direct: {{ number_format($assessment->num_direct_beneficiary) }}
                                </div>
                                <div class="committee">
                                    Indirect: {{ number_format($assessment->num_indirect_beneficiary) }}
                                </div>
                            </td>
                            <td class="duration">
                                <div class="participants">
                                    {{ number_format($assessment->num_direct_beneficiary + $assessment->num_indirect_beneficiary) }}
                                </div>
                                <div class="committee">Total beneficiaries</div>
                            </td>
                            <td class="created-info">
                                <div>{{ $assessment->created_at->format('M d, Y') }}</div>
                                <div class="created-by">{{ $assessment->user->name ?? 'N/A' }}</div>
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @else
            <div class="no-data">
                <p>No impact assessments found matching the specified criteria.</p>
            </div>
        @endif
    </div>

    <!-- Footer -->
    <div class="footer">
        <p>
            Impact Assessments Report |
            Generated: {{ $generated_at }} |
            Total Assessments in Report: {{ $assessments->count() }}
        </p>
    </div>
</body>

</html>
