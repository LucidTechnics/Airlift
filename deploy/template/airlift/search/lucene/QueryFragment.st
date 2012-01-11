query = new TermQuery(new Term("$className$.$attributeName$", token.term()));
booleanQuery.add(query, Occur.SHOULD);	
