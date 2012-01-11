package $package$.hannibal.search;

import $fullClassName$;
import $package$.hannibal.activerecord.$className$AR;

import hannibal.util.PropertyUtil;
import hannibal.util.FormatUtil;
import hannibal.search.lucene.Searcher;

import org.apache.lucene.analysis.Analyzer;
import org.apache.lucene.analysis.PerFieldAnalyzerWrapper;
import org.apache.lucene.analysis.PorterStemFilter;
import org.apache.lucene.analysis.LowerCaseFilter;
import org.apache.lucene.analysis.LowerCaseTokenizer;
import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.analysis.standard.StandardFilter;
import org.apache.lucene.analysis.standard.StandardTokenizer;
import org.apache.lucene.analysis.Token;
import org.apache.lucene.analysis.TokenStream;

import org.apache.lucene.document.Document;
import org.apache.lucene.document.Field.Index;
import org.apache.lucene.document.Field.Store;
import org.apache.lucene.document.Field;

import org.apache.lucene.index.IndexReader; 
import org.apache.lucene.index.IndexWriter; 
import org.apache.lucene.index.Term;

import org.apache.lucene.search.BooleanClause.Occur;
import org.apache.lucene.search.BooleanQuery;
import org.apache.lucene.search.IndexSearcher;
import org.apache.lucene.search.Query;
import org.apache.lucene.search.ScoreDoc;
import org.apache.lucene.search.TermQuery;
import org.apache.lucene.search.TopDocs;

import org.apache.lucene.store.FSDirectory;

@javax.annotation.Generated
(
	value="hannibal.generator.Generator",
	comments="$generatorJavaComment$",
	date = "$dateTimestamp$"
)
   
public class $className$Searcher
	extends Searcher
{
	protected $className$Searcher()
	{
		super();
	}

	public void index($className$AR _$lowercaseClassName$)
	{
		IndexWriter indexWriter = null;
		
		try
		{
			PropertyUtil.getInstance().loadProperties("/hannibal/Hannibal.properties", "hannibal.cfg");
			FSDirectory index = FSDirectory.getDirectory(PropertyUtil.getInstance().getProperty("hannibal.cfg", "hannibal.search.index.directory"));
			String maxfieldLengthString = PropertyUtil.getInstance().getProperty("hannibal.cfg", "hannibal.search.index.max.field.length");
			
			if ("0".equals(maxfieldLengthString) == true)
			{
				indexWriter = new IndexWriter(index, new PerFieldAnalyzerWrapper(new StandardAnalyzer()), IndexWriter.MaxFieldLength.UNLIMITED);
			}
			else if ("".equals(maxfieldLengthString) == false && maxfieldLengthString != null)
			{
				indexWriter = new IndexWriter(index, new PerFieldAnalyzerWrapper(new StandardAnalyzer()), IndexWriter.MaxFieldLength.LIMITED);
				indexWriter.setMaxFieldLength(Integer.parseInt(maxfieldLengthString));
			}
			
			PerFieldAnalyzerWrapper analyzer = new PerFieldAnalyzerWrapper(new StandardAnalyzer());

			Document document = new Document();
			Field field = new Field("H.className", "$className$", Store.YES, Index.NO);
			document.add(field);

			field = new Field("H.rdfa", _$lowercaseClassName$.toRdfa(), Store.COMPRESS, Index.NO);
			document.add(field);
			
			field = new Field("H.json", _$lowercaseClassName$.toJson(), Store.COMPRESS, Index.NO);
			document.add(field);

			field = new Field("H.domain", "$lowercaseClassName$", Store.COMPRESS, Index.NO);
			document.add(field);

			$indexFieldFragment; separator="\n\n"$

			indexWriter.addDocument(document);
		}
		catch(Throwable t)
		{
			throw new hannibal.HannibalException("Unable to create index", t);
		}
		finally
		{
			if (indexWriter != null) { try { indexWriter.close(); } catch(Throwable t) {} }
		}
	}

	public void deleteMatchingIndices(String _name, String _value)
	{
		if (_name != null)
		{
			IndexReader indexReader = null;

			try
			{
				PropertyUtil.getInstance().loadProperties("/hannibal/Hannibal.properties", "hannibal.cfg");
				FSDirectory index = FSDirectory.getDirectory(PropertyUtil.getInstance().getProperty("hannibal.cfg", "hannibal.search.index.directory"));
				indexReader = IndexReader.open(index);
				
				org.apache.lucene.index.Term term = new org.apache.lucene.index.Term("$className$." + _name, _value);
				
				indexReader.deleteDocuments(term);
			}
			catch(Throwable t)
			{
				throw new hannibal.HannibalException("Unable to create index", t);
			}
			finally
			{
				if (indexReader != null) { try { indexReader.close(); } catch(Throwable t) {} }
			}
		}
	}

	public java.util.List<java.util.Map<String, String>> search(String _criteria, String _returnAttributeCsv, int _hitLimit)
	{
		String[] returnAttributeArray = (_returnAttributeCsv == null) ? new String[0] : _returnAttributeCsv.split(",");

		return search(_criteria, returnAttributeArray, _hitLimit);
	}

	public java.util.List<java.util.Map<String, String>> search(String _criteria, String[] _returnAttributeArray, int _hitLimit)
	{
		java.util.List<java.util.Map<String, String>> hitList = new java.util.ArrayList<java.util.Map<String, String>>();
		
		if (_criteria != null)
		{
			IndexSearcher indexSearcher = null;
			Query query = null;
			BooleanQuery booleanQuery = new BooleanQuery();
			TokenStream tokenStream = null;
			Token token = new Token();
			StandardAnalyzer analyzer = new StandardAnalyzer();
			
			try
			{
				tokenStream = analyzer.reusableTokenStream(null, new java.io.StringReader(_criteria));

				token = tokenStream.next(token);

				while (token != null)
				{
					$queryFragment; separator="\n\n"$

					token = tokenStream.next(token);
				}
				
				PropertyUtil.getInstance().loadProperties("/hannibal/Hannibal.properties", "hannibal.cfg");
				FSDirectory index = FSDirectory.getDirectory(PropertyUtil.getInstance().getProperty("hannibal.cfg", "hannibal.search.index.directory"));
				indexSearcher = new IndexSearcher(index);
				
				TopDocs topDocs = indexSearcher.search(booleanQuery, _hitLimit);

				for (ScoreDoc scoreDoc: topDocs.scoreDocs)
				{
					Document document = indexSearcher.getIndexReader().document(scoreDoc.doc);

					java.util.Map<String, String> map = new java.util.HashMap<String, String>();

					String[] returnAttributeArray = (_returnAttributeArray == null) ? new String[0] : _returnAttributeArray;
					
					for (String returnAttribute: returnAttributeArray)
					{
						String searchString = "";
						
						if (returnAttribute.startsWith("H.") == true)
						{
							searchString = returnAttribute;
						}
						else
						{
							searchString = "$className$." + returnAttribute;
						}
						
						map.put(returnAttribute, document.get(searchString));
					}

					map.put("H.className", document.get("H.className"));
					map.put("H.rdfa", document.get("H.rdfa"));
					map.put("H.json", document.get("H.json"));
					map.put("H.domain", document.get("H.domain"));

					hitList.add(map);
				}
			}
			catch(Throwable t)
			{
				throw new hannibal.HannibalException("Unable to create index", t);
			}
			finally
			{
				if (indexSearcher != null) { try { indexSearcher.close(); } catch(Throwable t) {} }
				if (tokenStream != null) { try { tokenStream.close(); } catch(Throwable t) {} }
			}
		}

		return hitList;
	}
}