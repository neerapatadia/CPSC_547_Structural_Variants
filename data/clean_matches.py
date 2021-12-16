#!/usr/bin/env python

import re
import sys
import pandas as pd

def filter_phenotype(phenotype):
    pheno_lower = phenotype.lower()

    if pheno_lower == "not specified":
        return False
    if pheno_lower == "not provided":
        return False
    if pheno_lower == "see cases":
        return False
    
    return True

def get_phenotypes(pheno_string):
    pheno_list = re.split(r"[;|\|]", pheno_string)
    filtered_pheno_list = list(filter(filter_phenotype, pheno_list))

    if len(filtered_pheno_list):
        return ";".join(filtered_pheno_list)
    
    return "-"

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(f"Usage: {sys.argv[0]} <matches>")
        sys.exit(1)
    
    matches = sys.argv[1]

    keep_cols = ["CHROM", "POS", "END", "SVTYPE", "ClinicalSignificance", "Similarity",
                 "AlleleID", "PhenotypeList", "HGNC_ID"]
    chromosomes = [str(i) for i in list(range(1, 23))]
    chromosomes.extend(["X", "Y"])
    
    df = pd.read_csv(matches, usecols=keep_cols)

    df["Similarity"] = df["Similarity"].map(lambda x: round(x, 2))
    df["PhenotypeList"] = df["PhenotypeList"].map(get_phenotypes)
    df["CHROM"] = pd.Categorical(df["CHROM"], chromosomes)
    df.sort_values("CHROM", inplace=True)
    df.to_csv(sys.stdout, sep="\t", index=False)
