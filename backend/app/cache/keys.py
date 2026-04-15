# Cache Key Constants

def get_products_list_key(page: int, limit: int, category: str, sort: str) -> str:
    category_slug = category if category else "all"
    return f"products:list:{page}:{limit}:{category_slug}:{sort}"

def get_product_detail_key(product_id: str) -> str:
    return f"products:detail:{product_id}"

def get_categories_all_key() -> str:
    return "categories:all"

def get_search_results_key(query: str, page: int) -> str:
    return f"search:{query}:{page}"
