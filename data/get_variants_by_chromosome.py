#!/usr/bin/env python3

import sys
import pandas as pd

if __name__ == "__main__":
    if len(sys.argv) != 4:
        print(f"Usage: {sys.argv[0]} <table> <delimiter> <chromosome column name>")
        sys.exit(1)
    
    clinvar = sys.argv[1]
    delim = sys.argv[2]
    chrom_col = sys.argv[3]

    keep_cols = ["ClinicalSignificance", chrom_col]
    variants = pd.read_csv(clinvar, sep=delim, usecols=keep_cols, dtype=str)

    variants = variants.groupby(keep_cols).size().reset_index(name="Count")
    variants = variants.pivot_table(index=chrom_col, columns=["ClinicalSignificance"])["Count"].rename_axis(None, axis=1).reset_index()

    variants.rename(columns={chrom_col: "Chromosome"}).to_csv(sys.stdout, sep="\t", index=False, na_rep="0")
