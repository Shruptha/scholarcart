import Parser from 'rss-parser';

export async function refreshPapers(query, runSql, queryOne) {
    if (!query) return 0;

    const esearchUrl = new URL('https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi');
    esearchUrl.searchParams.append('db', 'pubmed');
    esearchUrl.searchParams.append('term', query);
    esearchUrl.searchParams.append('retmode', 'json');
    esearchUrl.searchParams.append('retmax', '20'); // Limit to 20 for performance here

    let added = 0;
    try {
        const esearchRes = await fetch(esearchUrl.toString());
        const esearchData = await esearchRes.json();
        const idList = esearchData.esearchresult?.idlist || [];

        if (idList.length === 0) return 0;

        const esummaryUrl = new URL('https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi');
        esummaryUrl.searchParams.append('db', 'pubmed');
        esummaryUrl.searchParams.append('id', idList.join(','));
        esummaryUrl.searchParams.append('retmode', 'json');

        const esummaryRes = await fetch(esummaryUrl.toString());
        const esummaryData = await esummaryRes.json();

        for (const pid of idList) {
            const paper = esummaryData.result?.[pid];
            if (!paper) continue;

            const id = `pmid:${pid}`;
            const existing = queryOne('SELECT id FROM items WHERE id = ?', [id]);
            if (!existing) {
                runSql(`INSERT INTO items (id, type, title, abstract, url, source, published_at) VALUES (?, ?, ?, ?, ?, ?, ?)`, [
                    id,
                    'paper',
                    paper.title || '',
                    '', // Abstract can be parsed from full fetch if necessary, keep empty for summary speed
                    `https://pubmed.ncbi.nlm.nih.gov/${pid}/`,
                    'PubMed',
                    paper.pubdate ? new Date(paper.pubdate).toISOString() : new Date().toISOString()
                ]);
                added++;
            }
        }
    } catch (e) {
        console.error('Error fetching papers:', e);
    }

    return added;
}

export async function refreshSignals(runSql, queryOne) {
    const parser = new Parser();
    const feeds = [
        { url: 'https://www.sebi.gov.in/sebirss.jsp?filetype=pressrelease', source: 'SEBI' },
        { url: 'https://timesofindia.indiatimes.com/rssfeedstopstories.cms', source: 'News placeholder for NSE' } // Generic fallback to demonstrate RSS, NSE has no direct valid RSS that is easily parseable without IP block.
    ];

    let added = 0;
    for (const feed of feeds) {
        try {
            const parsed = await parser.parseURL(feed.url);
            for (const item of parsed.items || []) {
                const id = `rss:${feed.source}:${item.guid || item.link}`;
                const existing = queryOne('SELECT id FROM items WHERE id = ?', [id]);
                if (!existing) {
                    runSql(`INSERT INTO items (id, type, title, abstract, url, source, published_at) VALUES (?, ?, ?, ?, ?, ?, ?)`, [
                        id,
                        'signal',
                        item.title || '',
                        item.contentSnippet || item.content || '',
                        item.link || '',
                        feed.source,
                        item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString()
                    ]);
                    added++;
                }
            }
        } catch (e) {
            console.error(`Error fetching signals from ${feed.source}:`, e);
        }
    }
    return added;
}
