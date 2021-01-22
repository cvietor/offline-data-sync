using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Models;
using Firebase.Database;
using Firebase.Database.Query;

using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectController : ControllerBase
    {
        private const string BaseUrl = "https://offline-data-sync-db-default-rtdb.europe-west1.firebasedatabase.app/";

        private readonly ILogger<ProjectController> _logger;

        public ProjectController(ILogger<ProjectController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public async Task<IEnumerable<Project>> Get()
        {
            var firebaseClient = new FirebaseClient(BaseUrl);

            var result = await firebaseClient
                .Child("Projects")
                .OnceAsync<Project>();

            return (result
                .Select(item =>
                {
                    item.Object.Id = item.Key;
                    return item.Object;
                })).ToList();
        }

        [HttpGet("{id}")]
        public async Task<Project> GetById(string id)
        {
            var firebaseClient = new FirebaseClient(BaseUrl);

            var result = await firebaseClient
                .Child("Projects")
                .Child(id)
                .OnceSingleAsync<Project>();

            return result;
        }

        [HttpPost]
        public async Task<ActionResult<string>> Post(Project project)
        {
            var firebaseClient = new FirebaseClient(BaseUrl);

            var result = await firebaseClient
                .Child("Projects")
                .PostAsync<Project>(project);

            return Ok(result);
        }

        [HttpPatch]
        public async Task Patch(Project project)
        {
            var firebaseClient = new FirebaseClient(BaseUrl);

            await firebaseClient
                .Child("Projects")
                .Child(project.Id)
                .PatchAsync(project);
        }

        [HttpDelete]
        public async Task Delete(string key)
        {
            var firebaseClient = new FirebaseClient(BaseUrl);

            await firebaseClient
                .Child("Projects")
                .Child(key)
                .DeleteAsync();
        }
    }
}
