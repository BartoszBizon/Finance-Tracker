using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos;
using api.Dtos.Stock;
using api.Models;

namespace api.Mappers
{
    public static class StockMappers
    {

        public static StockDto ToStockDto(this Stock stockModel)
        {
            return new StockDto
            {
                Id = stockModel.Id,
                Symbol = stockModel.Symbol,
                CompanyName = stockModel.CompanyName,
                PurchasePrice = stockModel.PurchasePrice,
                LastDiv = stockModel.LastDiv,
                Industry = stockModel.Industry,
                MarketCap = stockModel.MarketCap,
                Comments = stockModel.Comments.Select(c => c.ToCommentDto()).ToList()
            };
        }

        public static Stock ToStockFromCreateDTO(this CreateStockRequestDto stockDto)
        {
            return new Stock
            {
                Symbol = stockDto.Symbol,
                CompanyName = stockDto.CompanyName,
                PurchasePrice = stockDto.PurchasePrice,
                LastDiv = stockDto.LastDiv,
                Industry = stockDto.Industry,
                MarketCap = stockDto.MarketCap
            };
        }

        public static Stock ToStockFromFMP(this FMPStock fmpStock)
        {
            return new Stock
            {
                Symbol = fmpStock.symbol,
                CompanyName = fmpStock.companyName,
                PurchasePrice = (decimal)fmpStock.price,
                LastDiv = (decimal)fmpStock.lastDividend,
                Industry = fmpStock.industry,
                MarketCap = fmpStock.marketCap
            };
        }

    }
}