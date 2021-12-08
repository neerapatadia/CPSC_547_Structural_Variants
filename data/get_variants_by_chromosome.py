#!/usr/bin/env python3

import sys
import pandas as pd

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(f"Usage: {sys.argv[0]} <clinvar table>")
        sys.exit(1)
    
    clinvar = sys.argv[1]

    keep_cols = ["ClinicalSignificance", "Chromosome"]
    variants = pd.read_csv(clinvar, sep="\t", usecols=keep_cols, dtype=str)

    variants = variants.groupby(keep_cols).size().reset_index(name="Count")
    variants = variants.pivot_table(index="Chromosome", columns=["ClinicalSignificance"])["Count"].rename_axis(None, axis=1).reset_index()

    variants.to_csv(sys.stdout, sep="\t", index=False)
