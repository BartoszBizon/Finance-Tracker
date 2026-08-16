using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Extensions;
using api.interfaces;
using api.Models;
using api.Repository;
using api.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/portfolio")]
    public class PortfolioController : ControllerBase
    {

        private readonly UserManager<AppUser> _userManager;
        private readonly IStockRepository _stockRepo;
        private readonly IPortfolioRepository _portfolioRepo;
        private readonly IFMPService _fmpService;

        public PortfolioController(UserManager<AppUser> userManager, IStockRepository stockRepository, IPortfolioRepository portfolioRepo, IFMPService fMPService)
        {
            _userManager = userManager;
            _stockRepo = stockRepository;
            _portfolioRepo = portfolioRepo;
            _fmpService = fMPService;
        }


        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetUserPortfolio()
        {
            var username = User.GetUsername();
            var appUser = await _userManager.FindByNameAsync(username);
            var userPortfolio = await _portfolioRepo.GetUserPortfolio(appUser);
            return Ok(userPortfolio);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> AddPortfolio(string symbol)
        {
            var username = User.GetUsername();
            var appUser = await _userManager.FindByNameAsync(username);
            var stock = await _stockRepo.GetStockBySymbol(symbol);

            if (stock == null)
            {
                stock = await _fmpService.FindStockBySymbolAsync(symbol);
                if (stock == null)
                {
                    return BadRequest("Stock does not exist");
                }
                else
                {
                    await _stockRepo.CreateStockAsync(stock);
                }
            }


            if (stock == null)
            {
                return BadRequest("Stock doesnt exist");
            }

            var userPortfolio = await _portfolioRepo.GetUserPortfolio(appUser);
            if (userPortfolio.Any(x => x.Symbol.ToLower() == symbol.ToLower()))
            {
                return BadRequest("This stock is already added to portfolio");
            }

            var newPortfolio = new Portfolio
            {
                StockId = stock.Id,
                AppUserId = appUser.Id
            };

            await _portfolioRepo.CreateAsync(newPortfolio);
            if (newPortfolio == null)
            {
                return StatusCode(500, "Portfolio could not create");
            }

            return Created();
        }

        [HttpDelete]
        [Authorize]
        public async Task<IActionResult> DeletePortfolio(string symbol)
        {
            var username = User.GetUsername();
            var appUser = await _userManager.FindByNameAsync(username);
            var userPortfolio = await _portfolioRepo.GetUserPortfolio(appUser);


            var filteredStock = userPortfolio.Where(x => x.Symbol.ToLower() == symbol.ToLower()).ToList();


            if (filteredStock.Count == 1)
            {
                await _portfolioRepo.DeletePortfolio(appUser, symbol);
                return Ok();
            }

            return BadRequest("Stock is not in your portfolio");
        }

    }
}