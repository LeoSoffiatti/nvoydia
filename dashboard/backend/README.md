# NVoydia Dashboard API

A FastAPI backend that powers the NVoydia dashboard with comprehensive data models for companies, news, investments, rankings, people, and VCs with a scoring system.

## Features

- **Companies**: Industry segments, technical employee percentages, CEO metadata
- **News**: Headlines with date-based filtering and sorting
- **Investments**: Funding rounds with company associations
- **Rankings**: Company performance scoring and ranking system
- **People**: CEO profiles with LinkedIn URLs
- **VC Scoring System**: Venture capital firms ranked by pre-computed scores
- **Pagination**: All list endpoints support pagination
- **Filtering**: Industry segments, date ranges, investment stages
- **Sorting**: Multiple sort options for all endpoints

## Quick Start

### Prerequisites

- Python 3.8+
- pip

### Installation

1. **Clone the repository and navigate to the backend directory:**
   ```bash
   cd dashboard/backend
   ```

2. **Install dependencies:**
   ```bash
   pip install fastapi uvicorn sqlalchemy
   ```

3. **Run the application:**
   ```bash
   python main.py
   ```

   Or using uvicorn directly:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

4. **Access the API:**
   - API: http://localhost:8000
   - Interactive docs: http://localhost:8000/docs
   - Alternative docs: http://localhost:8000/redoc

## Database

The application automatically creates a SQLite database (`ass31.db`) on first run and populates it with sample data including:
- 3 sample companies (MediTech Solutions, HealthFlow, BioInnovate)
- 3 CEOs with LinkedIn profiles
- Sample news articles and investments
- Company rankings
- 3 sample VCs with scores

## API Endpoints

### Companies

#### GET /companies
List all companies with pagination and filtering.

**Query Parameters:**
- `page` (int): Page number (default: 1)
- `page_size` (int): Items per page (default: 10, max: 100)
- `industry_segment` (str): Filter by industry (e.g., "medical-imaging", "digital-health")
- `sort` (str): Sort order ("name", "-name")

**Example:**
```bash
GET /companies?page=1&page_size=5&industry_segment=medical-imaging&sort=name
```

#### GET /companies/{id}
Get detailed information about a specific company.

**Example:**
```bash
GET /companies/1
```

#### GET /companies/{id}/news
Get news articles for a specific company.

**Query Parameters:**
- `page` (int): Page number (default: 1)
- `page_size` (int): Items per page (default: 10, max: 100)

**Example:**
```bash
GET /companies/1/news?page=1&page_size=10
```

### News

#### GET /news
Get global news feed with filtering and date buckets.

**Query Parameters:**
- `page` (int): Page number (default: 1)
- `page_size` (int): Items per page (default: 10, max: 100)
- `industry_segment` (str): Filter by industry segment
- `date_range` (str): Date filter ("2w", "1m", "1q", "1y")
- `sort` (str): Sort order ("published_at", "-published_at")

**Example:**
```bash
GET /news?date_range=1m&industry_segment=digital-health&sort=-published_at
```

### Investments

#### GET /investments
List investments with optional company filtering.

**Query Parameters:**
- `page` (int): Page number (default: 1)
- `page_size` (int): Items per page (default: 10, max: 100)
- `company_id` (int): Filter by specific company

**Example:**
```bash
GET /investments?company_id=1&page=1&page_size=5
```

### Rankings

#### GET /rankings
Get company rankings by category.

**Query Parameters:**
- `page` (int): Page number (default: 1)
- `page_size` (int): Items per page (default: 10, max: 100)
- `category` (str): Filter by ranking category (e.g., "overall", "technical")

**Example:**
```bash
GET /rankings?category=overall&page=1&page_size=10
```

### People

#### GET /people/{id}
Get detailed information about a person (CEO).

**Example:**
```bash
GET /people/1
```

### VCs

#### GET /vcs
List VCs ordered by final score (highest first).

**Query Parameters:**
- `page` (int): Page number (default: 1)
- `page_size` (int): Items per page (default: 10, max: 100)
- `sort` (str): Sort order ("final_score", "-final_score")
- `investment_stage` (str): Filter by investment stage

**Example:**
```bash
GET /vcs?investment_stage=multi-stage&sort=-final_score
```

#### GET /vcs/{id}
Get detailed information about a specific VC.

**Example:**
```bash
GET /vcs/1
```

#### POST /vcs/recompute
Placeholder endpoint for recomputing VC scores.

**Example:**
```bash
POST /vcs/recompute
```

## Data Models

### Company
- `id`: Primary key
- `name`: Company name
- `industry_segment`: Industry classification
- `technical_employees_pct`: Percentage of technical employees
- `ceo_id`: Reference to CEO (Person)
- `created_at`: Creation timestamp

### Person
- `id`: Primary key
- `name`: Person's name
- `title`: Job title
- `linkedin_url`: LinkedIn profile URL
- `created_at`: Creation timestamp

### News
- `id`: Primary key
- `headline`: News headline
- `content`: News content
- `published_at`: Publication date
- `source`: News source
- `company_id`: Reference to company
- `created_at`: Creation timestamp

### Investment
- `id`: Primary key
- `company_id`: Reference to company
- `round_type`: Funding round type (e.g., "Series A")
- `amount`: Investment amount
- `currency`: Currency (default: "USD")
- `date`: Investment date
- `created_at`: Creation timestamp

### Ranking
- `id`: Primary key
- `company_id`: Reference to company
- `rank`: Ranking position
- `score`: Performance score
- `category`: Ranking category
- `created_at`: Creation timestamp

### VC
- `id`: Primary key
- `name`: VC firm name
- `description`: Firm description
- `website`: Website URL
- `location`: Geographic location
- `investment_stage`: Investment stage focus
- `final_score`: Pre-computed scoring
- `created_at`: Creation timestamp

## Response Format

All list endpoints return a paginated response:

```json
{
  "page": 1,
  "page_size": 10,
  "total": 25,
  "results": [...]
}
```

## Error Handling

The API returns appropriate HTTP status codes:
- `200`: Success
- `404`: Resource not found
- `422`: Validation error
- `500`: Internal server error

## Development

### Adding New Endpoints

1. Define the data model in the appropriate section
2. Create Pydantic models for request/response validation
3. Add the endpoint function with proper error handling
4. Include pagination and filtering as needed

### Database Schema Changes

1. Modify the SQLAlchemy model classes
2. Update the Pydantic models accordingly
3. Run the application to automatically create new tables

### VC Scoring Algorithm

The current implementation includes a placeholder for VC scoring. To implement a real scoring system:

1. Modify the `recompute_vc_scores` endpoint
2. Query portfolio companies and their performance metrics
3. Calculate scores based on your algorithm (e.g., exit rates, portfolio growth, fund performance)
4. Update the `final_score` field for each VC

## Sample Data

The application automatically creates sample data on startup:

**Companies:**
- MediTech Solutions (medical-imaging, 75% technical)
- HealthFlow (digital-health, 60% technical)
- BioInnovate (biotech, 80% technical)

**VCs:**
- Sequoia Capital (score: 95.8)
- Andreessen Horowitz (score: 92.3)
- First Round Capital (score: 87.6)

## CORS

The API includes CORS middleware configured to allow all origins, making it suitable for frontend development.

## Production Considerations

For production deployment:

1. **Database**: Consider using PostgreSQL or MySQL instead of SQLite
2. **Authentication**: Add JWT or OAuth authentication
3. **Rate Limiting**: Implement API rate limiting
4. **Logging**: Add comprehensive logging
5. **Monitoring**: Add health checks and metrics
6. **Environment Variables**: Use environment variables for configuration

## Support

For questions or issues, please refer to the project documentation or contact the development team.
