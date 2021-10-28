# Data

## Clinvar
`variant_summary_2021-10.GRCh37.sv.txt`
- October 2021 Archive
- Filtered to remove GRCh38 variants and variants with Type == "Indel" or Type == "single nucleotide variant"
- See [here](https://ftp.ncbi.nlm.nih.gov/pub/clinvar/tab_delimited/README) for more details


## HG002 Sequence-Resolved SV Calls
`HG002_SVs_Tier1_v0.6.50bp_plus.clean.vcf`
- For some reason, variants less than 50bp were included in the original (FILTER field 'lt50bp'). These smaller variants were filtered out
- See [here](https://ftp-trace.ncbi.nlm.nih.gov/ReferenceSamples/giab/data/AshkenazimTrio/analysis/NIST_SVs_Integration_v0.6/README_SV_v0.6.txt) for more details
