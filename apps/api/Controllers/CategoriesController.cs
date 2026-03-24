using LostNFound.Api.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LostNFound.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<CategoryResponse>>> GetAll() =>
        await db.Categories.Select(c => new CategoryResponse(c.Id, c.Name)).ToListAsync();
}


public record CategoryResponse(Guid Id, string Name);
