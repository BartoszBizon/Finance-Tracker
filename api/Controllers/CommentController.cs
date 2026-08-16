using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos;
using api.Dtos.Comment;
using api.Extensions;
using api.Helpers;
using api.interfaces;
using api.Mappers;
using api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/comment")]
    [ApiController]
    public class CommentController : ControllerBase
    {

        private readonly ICommentRepository _commentRepo;
        private readonly IStockRepository _stockRepo;
        private readonly UserManager<AppUser> _userManager;
        private readonly IFMPService _fmpService;

        public CommentController(ICommentRepository commentRepo, IStockRepository stockRepo, UserManager<AppUser> userManager, IFMPService fmpService)
        {
            _commentRepo = commentRepo;
            _stockRepo = stockRepo;
            _userManager = userManager;
            _fmpService = fmpService;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAllComments([FromQuery]CommentQueryObject queryObject)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var comments = await _commentRepo.GetAllCommentsAsync(queryObject);
            var commentDtos = comments.Select(c => c.ToCommentDto());
            return Ok(commentDtos);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var comment = await _commentRepo.GetCommentByIdAsync(id);
            if (comment == null)
            {
                return NotFound();
            }
            var commentDto = comment.ToCommentDto();
            return Ok(commentDto);
        }

        [HttpPost]
        [Route("{symbol:alpha}")]
        public async Task<IActionResult> Create([FromRoute] string symbol, CreateCommentDto commentDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

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

            var username = User.GetUsername();
            var appUser = await _userManager.FindByNameAsync(username);

            var commentModel = commentDto.ToCommentFromCreate(stock.Id);
            commentModel.AppUserId = appUser.Id;
            await _commentRepo.CreateCommentAsync(commentModel);
            return CreatedAtAction(nameof(GetById), new { id = commentModel.Id }, commentModel.ToCommentDto());
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var commentModel = await _commentRepo.DeleteCommentAsync(id);
            if (commentModel == null)
            {
                return NotFound("Comment not exist");
            }

            return NoContent();
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update([FromRoute] int id, [FromBody] UpdateCommentDto commentModel)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var updatedComment = await _commentRepo.UpdateCommentAsync(id, commentModel.ToCommentFromUpdate());
            if (updatedComment == null)
            {
                return NotFound("Comment not exist");
            }

            return Ok(updatedComment.ToCommentDto());
        }

    }
}