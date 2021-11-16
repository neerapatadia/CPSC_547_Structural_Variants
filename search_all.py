import sys
import pandas as pd
from skbio import DNA
from skbio.alignment import local_pairwise_align_ssw

margin = 20

df = pd.read_csv(sys.argv[1], sep='\t', dtype={'Start': int, 'Type': str}).rename(columns={'#AlleleID': 'AlleleID'})
hg002 = pd.read_csv(sys.argv[2], sep='\t', dtype={'POS': int, 'CHROM': str})

sv_types = {'INS': 'Insertion', 'DEL': 'Deletion'}

total = 0
matches_found = 0


results = []

for i, s in hg002.iterrows():
	total += 1
	query_loc = s['POS']
	query_chrm = s['CHROM']
	query_var = s['ALT']
	tmp_dict = dict(item.split("=") for item in s['INFO'].split(";"))
	query_type = 'MISC'
	if 'SVTYPE' in tmp_dict and tmp_dict['SVTYPE'] in sv_types:
		query_type = sv_types[tmp_dict['SVTYPE']]
	found = df.loc[(df['Start'] >= (query_loc - margin)) & (df['Start'] <= (query_loc + margin)) & (df['Chromosome'].str.match(query_chrm)) & (df['Type'].str.match(query_type))]
	if len(found) > 0:
		for i, f in found.iterrows():
			tmp_result = []
			tmp_result.extend(s)
			matches_found += 1
			try:
				alignment, score, start_end_positions = local_pairwise_align_ssw(DNA(query_var), DNA(f['AlternateAlleleVCF']))
				similarity = (score / (len(f['AlternateAlleleVCF']) + len(query_var))) * 100
			except ValueError:
				similarity = 0.0
			tmp_result.extend(f)
			tmp_result.extend([similarity])
		results.append(tmp_result)
	header = []
	header.extend(list(hg002.columns))
	header.extend(list(df.columns))
	header.extend(["Similarity"])
	results_df = pd.DataFrame(results, columns=header)

# results_df.to_csv(sys.argv[3], sep='\t', index=None, header=None)
results_df.to_csv(sys.argv[3], sep='\t', index=None)