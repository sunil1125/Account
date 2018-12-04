using System;
using System.Collections;
using System.Collections.Generic;
using System.Web.Http;

namespace Swashbuckle.Dummy.Controllers
{
    public class ConflictingActionsController : ApiController
    {
        public string GetAll()
        {
            return "Hello";
        }

        public IEnumerable<string> GetAllByKeyword(string keyword)
        {
            throw new NotImplementedException();
        }
    }
}