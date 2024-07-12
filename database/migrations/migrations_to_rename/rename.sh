#!/bin/bash

# Itere sobre os arquivos no formato especificado, mantendo a ordem
for file in $(ls *.php | sort); do
    # Obtenha a data e a hora atuais
    current_date_time=$(date +%Y_%m_%d_%H%M%S)

    # Extraia a parte do nome após a data e hora
    suffix=$(echo $file | sed -E 's/^[0-9_]+_(.*)$/\1/')

    # Formate o novo nome do arquivo com a data e hora atuais
    new_file="${current_date_time}_${suffix}"

    # Renomeie o arquivo
    mv "$file" "$new_file"

    # Aguarde um segundo antes de passar para o próximo arquivo
    sleep 1
done
